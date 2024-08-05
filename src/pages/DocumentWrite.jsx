import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

const DocumentWrite = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [recipient, setRecipient] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the document to your backend
    console.log({ title, content, recipient });
    toast({
      title: "Document Created",
      description: "Your document has been successfully created and saved as a draft.",
    });
    // Reset form
    setTitle('');
    setContent('');
    setRecipient('');
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Create New Document</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter document title"
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">Content</label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter document content"
            rows={10}
            required
          />
        </div>
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium mb-1">Recipient</label>
          <Select onValueChange={setRecipient} required>
            <SelectTrigger>
              <SelectValue placeholder="Select recipient" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="R1">Robert Smith</SelectItem>
              <SelectItem value="R2">Emma Johnson</SelectItem>
              <SelectItem value="HR">Human Resources</SelectItem>
              <SelectItem value="OM">Operations Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full">Create Document</Button>
      </form>
    </div>
  );
};

export default DocumentWrite;
