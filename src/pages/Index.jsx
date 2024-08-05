import { useState, useMemo, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Clock, CheckCircle, FileText, Loader2, PenTool, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import ReactConfetti from 'react-confetti';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Toast } from "@/components/ui/toast";

const fetchDocuments = async ({ queryKey }) => {
  const [_, page, perPage] = queryKey;
  const apiUrl = `https://express-hello-world-6wub.onrender.com/documents?page=${page}&perPage=${perPage}`;
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`;
  try {
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

const fetchDocumentDetails = async (id) => {
  const apiUrl = `https://express-hello-world-6wub.onrender.com/documents/${id}`;
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`;
  try {
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching document details:', error);
    throw error;
  }
};

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(1);
  const perPage = 20;
  const { toast } = useToast();
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);

  useEffect(() => {
    if (location.state?.documentAdded) {
      toast({
        title: "Success",
        description: "Document added successfully",
        variant: "default",
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, toast, navigate]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['documents', page, perPage],
    queryFn: fetchDocuments,
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to load documents. Please try again later.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (location.state?.documentAdded) {
      toast({
        title: "Success",
        description: "Document added successfully",
        variant: "default",
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, toast, navigate]);

  const { data: documentDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['documentDetails', selectedDocumentId],
    queryFn: () => fetchDocumentDetails(selectedDocumentId),
    enabled: !!selectedDocumentId,
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to load document details. Please try again later.",
        variant: "destructive",
      });
    },
  });

  const documents = useMemo(() => {
    if (!data || !data.documents) return [];
    return data.documents.map(doc => ({
      id: doc.id,
      created: new Date(doc.createdAt).toLocaleString(),
      title: doc.title,
      recipient: doc.externalId || 'N/A',
      status: doc.status,
      action: doc.status === 'COMPLETED' ? 'Download' : doc.status === 'PENDING' ? 'Sign' : 'Edit',
    }));
  }, [data]);

  const totalPages = data?.totalPages || 1;
  const [activeFilter, setActiveFilter] = useState('All');
  const [downloadingId, setDownloadingId] = useState(null);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'off' });

  const recipientInfo = {
    R1: { name: "Robert Smith", email: "robert.smith@example.com", department: "Sales" },
    R2: { name: "Emma Johnson", email: "emma.johnson@example.com", department: "Marketing" },
    HR: { name: "Human Resources", email: "hr@example.com", department: "Human Resources" },
    OM: { name: "Operations Manager", email: "operations@example.com", department: "Operations" },
  };

  const handleRecipientClick = (recipient) => {
    setSelectedRecipient(recipient);
    setIsModalOpen(true);
  };

  const filteredDocuments = useMemo(() => {
    let filtered = activeFilter === 'All' 
      ? documents 
      : documents.filter(doc => {
          if (activeFilter === 'Inbox') return doc.status !== 'DRAFT';
          return doc.status.toUpperCase() === activeFilter.toUpperCase();
        });

    if (sortConfig.key !== null) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [documents, activeFilter, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'off';
    }
    setSortConfig({ key: direction === 'off' ? null : key, direction });
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key === columnName) {
      if (sortConfig.direction === 'ascending') return <ArrowUp className="w-4 h-4 ml-1" />;
      if (sortConfig.direction === 'descending') return <ArrowDown className="w-4 h-4 ml-1" />;
    }
    return <ArrowUpDown className="w-4 h-4 ml-1" />;
  };

  const counts = useMemo(() => ({
    All: documents.length,
    Inbox: documents.filter(doc => doc.status !== 'DRAFT').length,
    Pending: documents.filter(doc => doc.status === 'PENDING').length,
    Completed: documents.filter(doc => doc.status === 'COMPLETED').length,
    Draft: documents.filter(doc => doc.status === 'DRAFT').length,
  }), [documents]);

  const handleDocumentComplete = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000); // Stop confetti after 5 seconds
    toast({
      title: "Document Completed",
      description: "The document has been successfully signed and completed.",
    });
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {showConfetti && <ReactConfetti recycle={false} />}
      <header className="bg-card border-b border-border p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <nav>
              <ul className="flex space-x-4">
                <li className="text-primary font-semibold">Documents</li>
                <li className="text-muted-foreground hover:text-foreground">Templates</li>
              </ul>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Input type="text" placeholder="Search" className="w-64 bg-secondary" />
            <Button variant="outline" className="bg-secondary text-secondary-foreground">HR</Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={activeFilter === 'Inbox' ? 'default' : 'outline'}
                className={`text-sm ${activeFilter === 'Inbox' ? 'bg-yellow-400 hover:bg-yellow-500 text-black' : 'bg-secondary hover:bg-secondary/80'}`}
                onClick={() => setActiveFilter('Inbox')}
              >
                <FileText className="w-4 h-4 mr-2" /> Inbox <span className="ml-1">{counts.Inbox}</span>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={activeFilter === 'Pending' ? 'default' : 'outline'}
                className={`text-sm ${activeFilter === 'Pending' ? 'bg-yellow-400 hover:bg-yellow-500 text-black' : 'bg-secondary hover:bg-secondary/80'}`}
                onClick={() => setActiveFilter('Pending')}
              >
                <Clock className="w-4 h-4 mr-2" /> Pending <span className="ml-1">{counts.Pending}</span>
              </Button>
            </motion.div>
            <Button
              variant={activeFilter === 'Completed' ? 'default' : 'outline'}
              className={`text-sm ${activeFilter === 'Completed' ? 'bg-yellow-400 hover:bg-yellow-500 text-black' : 'bg-secondary hover:bg-secondary/80'}`}
              onClick={() => setActiveFilter('Completed')}
            >
              <CheckCircle className="w-4 h-4 mr-2" /> Completed <span className="ml-1">{counts.Completed}</span>
            </Button>
            <Button
              variant={activeFilter === 'Draft' ? 'default' : 'outline'}
              className={`text-sm ${activeFilter === 'Draft' ? 'bg-yellow-400 hover:bg-yellow-500 text-black' : 'bg-secondary hover:bg-secondary/80'}`}
              onClick={() => setActiveFilter('Draft')}
            >
              <FileText className="w-4 h-4 mr-2" /> Draft <span className="ml-1">{counts.Draft}</span>
            </Button>
            <Button
              variant={activeFilter === 'All' ? 'default' : 'outline'}
              className={`text-sm ${activeFilter === 'All' ? 'bg-yellow-400 hover:bg-yellow-500 text-black' : 'bg-secondary hover:bg-secondary/80'}`}
              onClick={() => setActiveFilter('All')}
            >
              All <span className="ml-1">{counts.All}</span>
            </Button>
          </div>
          <Button
            onClick={() => navigate('/write')}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <PenTool className="w-4 h-4 mr-2" /> New Document
          </Button>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="max-h-[calc(100vh-300px)] overflow-auto custom-scrollbar">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="text-muted-foreground sticky top-0 bg-background cursor-pointer"
                      onClick={() => requestSort('created')}
                    >
                      Created {getSortIcon('created')}
                    </TableHead>
                    <TableHead 
                      className="text-muted-foreground sticky top-0 bg-background cursor-pointer"
                      onClick={() => requestSort('title')}
                    >
                      Title {getSortIcon('title')}
                    </TableHead>
                    <TableHead 
                      className="text-muted-foreground sticky top-0 bg-background cursor-pointer"
                      onClick={() => requestSort('recipient')}
                    >
                      Recipient {getSortIcon('recipient')}
                    </TableHead>
                    <TableHead 
                      className="text-muted-foreground sticky top-0 bg-background cursor-pointer"
                      onClick={() => requestSort('status')}
                    >
                      Status {getSortIcon('status')}
                    </TableHead>
                    <TableHead className="text-muted-foreground sticky top-0 bg-background">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc, index) => (
                    <motion.tr
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <TableCell className="text-muted-foreground">{doc.created}</TableCell>
                      <TableCell>
                        <span
                          className="cursor-pointer hover:text-primary transition-colors duration-200"
                          onClick={() => setSelectedDocumentId(doc.id)}
                        >
                          {doc.title}
                        </span>
                      </TableCell>
                      <TableCell>
                        {doc.recipient.split(', ').map((recipient, index) => (
                          <span
                            key={index}
                            className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors duration-200"
                            onClick={() => handleRecipientClick(recipient)}
                          >
                            {recipient}{index < doc.recipient.split(', ').length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          doc.status === 'COMPLETED' ? 'bg-green-500/20 text-green-500' :
                          doc.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500' :
                          doc.status === 'DRAFT' ? 'bg-blue-500/20 text-blue-500' :
                          'bg-gray-500/20 text-gray-500'
                        }`}>
                          {doc.status.charAt(0) + doc.status.slice(1).toLowerCase()}
                        </span>
                      </TableCell>
                      <TableCell>
                        {doc.action && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              if (doc.action === 'Download') {
                                setDownloadingId(doc.id);
                                setTimeout(() => {
                                  setDownloadingId(null);
                                  toast({
                                    title: "Download Complete",
                                    description: "The document has been successfully downloaded.",
                                  });
                                }, 2000); // Simulating download for 2 seconds
                              } else if (doc.action === 'Sign') {
                                // Simulate signing process
                                setTimeout(() => {
                                  handleDocumentComplete();
                                  // Update the document status to 'COMPLETED'
                                  // This is a simplified example. In a real app, you'd update the server state.
                                  const updatedDocs = documents.map(d => 
                                    d.id === doc.id ? {...d, status: 'COMPLETED', action: 'Download'} : d
                                  );
                                  // Update your state or refetch documents here
                                }, 1000);
                              }
                            }}
                            disabled={downloadingId === doc.id}
                          >
                            {downloadingId === doc.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            {downloadingId === doc.id ? 'Downloading...' : doc.action}
                          </Button>
                        )}
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-between items-center mt-4 text-muted-foreground">
          <p>Showing {filteredDocuments.length} results.</p>
          <div className="flex items-center space-x-2">
            <span>Page {page} of {totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </main>

      <>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-background text-foreground">
            <DialogHeader>
              <DialogTitle>Recipient Information</DialogTitle>
            </DialogHeader>
            {selectedRecipient && recipientInfo[selectedRecipient] && (
              <div className="mt-4 space-y-2">
                <p><strong className="text-muted-foreground">Name:</strong> <span>{recipientInfo[selectedRecipient].name}</span></p>
                <p><strong className="text-muted-foreground">Email:</strong> <span>{recipientInfo[selectedRecipient].email}</span></p>
                <p><strong className="text-muted-foreground">Department:</strong> <span>{recipientInfo[selectedRecipient].department}</span></p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={!!selectedDocumentId} onOpenChange={() => setSelectedDocumentId(null)}>
          <DialogContent 
            className="bg-background text-foreground"
          >
            <DialogHeader>
              <DialogTitle>Document Details</DialogTitle>
            </DialogHeader>
            {isLoadingDetails ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            ) : documentDetails ? (
              <div className="mt-4 space-y-2">
                <p><strong className="text-muted-foreground">Title:</strong> <span>{documentDetails.title}</span></p>
                <p><strong className="text-muted-foreground">Created At:</strong> <span>{new Date(documentDetails.createdAt).toLocaleString()}</span></p>
                <p><strong className="text-muted-foreground">Status:</strong> <span>{documentDetails.status}</span></p>
                <p><strong className="text-muted-foreground">External ID:</strong> <span>{documentDetails.externalId || 'N/A'}</span></p>
              </div>
            ) : (
              <p>No details available</p>
            )}
          </DialogContent>
        </Dialog>
      </>

    </div>
  );
};

export default Index;
