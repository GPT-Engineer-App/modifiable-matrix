import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Clock, CheckCircle, FileText, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const Index = () => {
  const [documents] = useState([
    { id: 1, created: '02/08/2024, 4:45 pm', title: 'VanRein.pdf', recipient: 'R1', status: 'Completed', action: 'Download' },
    { id: 2, created: '02/08/2024, 1:48 pm', title: 'Document Title', recipient: 'R1, R2', status: 'Pending', action: 'Sign' },
    { id: 3, created: '02/08/2024, 1:29 pm', title: 'Document Title', recipient: 'R1, R2', status: 'Pending', action: '' },
    { id: 4, created: '02/08/2024, 1:22 pm', title: 'Document Title', recipient: 'HR, R1', status: 'Draft', action: 'Edit' },
    { id: 5, created: '20/02/2024, 2:19 pm', title: 'Retainer Agreement IMS', recipient: 'OM, HR', status: 'Completed', action: 'Download' },
  ]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [downloadingId, setDownloadingId] = useState(null);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    if (activeFilter === 'All') return documents;
    return documents.filter(doc => {
      if (activeFilter === 'Inbox') return doc.status !== 'Draft';
      return doc.status === activeFilter;
    });
  }, [documents, activeFilter]);

  const counts = useMemo(() => ({
    Inbox: documents.filter(doc => doc.status !== 'Draft').length,
    Pending: documents.filter(doc => doc.status === 'Pending').length,
    Completed: documents.filter(doc => doc.status === 'Completed').length,
    Draft: documents.filter(doc => doc.status === 'Draft').length,
  }), [documents]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground dark">
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
        <div className="flex space-x-2 mb-4">
          <Button
            variant={activeFilter === 'Inbox' ? 'default' : 'secondary'}
            className="text-sm"
            onClick={() => setActiveFilter('Inbox')}
          >
            <FileText className="w-4 h-4 mr-2" /> Inbox {counts.Inbox}
          </Button>
          <Button
            variant={activeFilter === 'Pending' ? 'default' : 'secondary'}
            className="text-sm"
            onClick={() => setActiveFilter('Pending')}
          >
            <Clock className="w-4 h-4 mr-2" /> Pending {counts.Pending}
          </Button>
          <Button
            variant={activeFilter === 'Completed' ? 'default' : 'secondary'}
            className="text-sm"
            onClick={() => setActiveFilter('Completed')}
          >
            <CheckCircle className="w-4 h-4 mr-2" /> Completed {counts.Completed}
          </Button>
          <Button
            variant={activeFilter === 'Draft' ? 'default' : 'secondary'}
            className="text-sm"
            onClick={() => setActiveFilter('Draft')}
          >
            <FileText className="w-4 h-4 mr-2" /> Draft {counts.Draft}
          </Button>
          <Button
            variant={activeFilter === 'All' ? 'default' : 'secondary'}
            className="text-sm"
            onClick={() => setActiveFilter('All')}
          >
            All
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-muted-foreground">Created</TableHead>
              <TableHead className="text-muted-foreground">Title</TableHead>
              <TableHead className="text-muted-foreground">Recipient</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="text-muted-foreground">{doc.created}</TableCell>
                <TableCell>{doc.title}</TableCell>
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
                    doc.status === 'Completed' ? 'bg-green-500/20 text-green-500' :
                    doc.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-blue-500/20 text-blue-500'
                  }`}>
                    {doc.status}
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
                          }, 2000); // Simulating download for 2 seconds
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center mt-4 text-muted-foreground">
          <p>Showing {filteredDocuments.length} results.</p>
          <div className="flex items-center space-x-2">
            <span>Rows per page</span>
            <select className="bg-secondary text-secondary-foreground rounded p-1">
              <option>20</option>
            </select>
            <span>Page 1 of 1</span>
          </div>
        </div>
      </main>

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
    </div>
  );
};

export default Index;
