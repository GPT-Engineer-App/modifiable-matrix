import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import MDEditor from '@uiw/react-md-editor';
import ReactMarkdown from 'react-markdown';
import { Bold, Italic, Link, List, ListOrdered } from 'lucide-react';

const DocumentWrite = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('# Start your document here');
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
          <MDEditor
            value={content}
            onChange={setContent}
            preview="edit"
            height={400}
            className="bg-background text-foreground"
            toolbarHeight={40}
            visibleDragbar={false}
            textareaProps={{
              placeholder: "Write your document here...",
            }}
            components={{
              toolbar: (command, disabled, executeCommand) => {
                if (command.name === 'bold' || command.name === 'italic' || command.name === 'link' || command.name === 'unordered-list' || command.name === 'ordered-list') {
                  return (
                    <button
                      key={command.name}
                      disabled={disabled}
                      onClick={() => executeCommand(command)}
                      className="p-2 hover:bg-secondary rounded-md transition-colors duration-200"
                    >
                      {command.name === 'bold' && <Bold size={16} />}
                      {command.name === 'italic' && <Italic size={16} />}
                      {command.name === 'link' && <Link size={16} />}
                      {command.name === 'unordered-list' && <List size={16} />}
                      {command.name === 'ordered-list' && <ListOrdered size={16} />}
                    </button>
                  );
                }
                return null;
              },
            }}
          />
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Preview</h3>
          <div className="border border-border rounded-md p-4 bg-card">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
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
