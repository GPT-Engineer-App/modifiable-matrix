import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Clock, CheckCircle, FileText } from 'lucide-react';

const Index = () => {
  const [documents] = useState([
    { id: 1, created: '02/08/2024, 4:45 pm', title: 'VanRein.pdf', recipient: 'R1', status: 'Completed', action: 'Download' },
    { id: 2, created: '02/08/2024, 1:48 pm', title: 'Document Title', recipient: 'R1, R2', status: 'Pending', action: 'Sign' },
    { id: 3, created: '02/08/2024, 1:29 pm', title: 'Document Title', recipient: 'R1, R2', status: 'Pending', action: '' },
    { id: 4, created: '02/08/2024, 1:22 pm', title: 'Document Title', recipient: 'HR, R1', status: 'Draft', action: 'Edit' },
    { id: 5, created: '20/02/2024, 2:19 pm', title: 'Retainer Agreement IMS', recipient: 'OM, HR', status: 'Completed', action: 'Download' },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="bg-card border-b border-border p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <nav>
              <ul className="flex space-x-4">
                <li className="text-primary">Documents</li>
                <li>Templates</li>
              </ul>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Input type="text" placeholder="Search" className="w-64" />
            <Button variant="outline">HR</Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4">
        <div className="flex space-x-2 mb-4">
          <Button variant="secondary" className="text-sm"><FileText className="w-4 h-4 mr-2" /> Inbox 1</Button>
          <Button variant="secondary" className="text-sm"><Clock className="w-4 h-4 mr-2" /> Pending 2</Button>
          <Button variant="secondary" className="text-sm"><CheckCircle className="w-4 h-4 mr-2" /> Completed 2</Button>
          <Button variant="secondary" className="text-sm"><FileText className="w-4 h-4 mr-2" /> Draft 1</Button>
          <Button variant="secondary" className="text-sm">All</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Created</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>{doc.created}</TableCell>
                <TableCell>{doc.title}</TableCell>
                <TableCell>{doc.recipient}</TableCell>
                <TableCell>{doc.status}</TableCell>
                <TableCell>
                  {doc.action && (
                    <Button variant="secondary" size="sm">
                      {doc.action}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center mt-4">
          <p>Showing 5 results.</p>
          <div className="flex items-center space-x-2">
            <span>Rows per page</span>
            <select className="bg-secondary text-secondary-foreground rounded p-1">
              <option>20</option>
            </select>
            <span>Page 1 of 1</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
