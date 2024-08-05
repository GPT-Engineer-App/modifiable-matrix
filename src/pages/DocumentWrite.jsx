import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import MDEditor from '@uiw/react-md-editor';
import ReactMarkdown from 'react-markdown';
import { Bold, Italic, Link, List, ListOrdered, Maximize, Minimize, Eye, EyeOff } from 'lucide-react';

const DocumentWrite = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('# Start your document here');
  const [recipient, setRecipient] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const editorRef = useRef(null);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      editorRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

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
        <div ref={editorRef} className="relative">
          <label htmlFor="content" className="block text-sm font-medium mb-1">Content</label>
          <div className="flex justify-end space-x-2 mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullScreen}
              className="flex items-center"
            >
              {isFullScreen ? <Minimize size={16} /> : <Maximize size={16} />}
              <span className="ml-1">{isFullScreen ? 'Exit Full Screen' : 'Full Screen'}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center"
            >
              {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
              <span className="ml-1">{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
            </Button>
          </div>
          <MDEditor
            value={content}
            onChange={setContent}
            preview="edit"
            height={isFullScreen ? '100vh' : 400}
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
          {isFullScreen && showPreview && (
            <div className="fixed bottom-4 right-4 w-1/3 h-1/3 border border-border rounded-md p-4 bg-card overflow-auto">
              <h3 className="text-lg font-medium mb-2">Preview</h3>
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-2" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-2" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-2" {...props} />,
                  p: ({ node, ...props }) => <p className="mb-4" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4" {...props} />,
                  li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                  a: ({ node, ...props }) => <a className="text-blue-500 hover:underline" {...props} />,
                  blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-4" {...props} />,
                  code: ({ node, inline, ...props }) => 
                    inline 
                      ? <code className="bg-gray-100 rounded px-1 py-0.5" {...props} />
                      : <pre className="bg-gray-100 rounded p-2 mb-4 overflow-x-auto"><code {...props} /></pre>,
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        {!isFullScreen && (
          <div>
            <h3 className="text-lg font-medium mb-2">Preview</h3>
            <div className="border border-border rounded-md p-4 bg-card overflow-auto max-h-[400px]">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-2" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-2" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-2" {...props} />,
                  p: ({ node, ...props }) => <p className="mb-4" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4" {...props} />,
                  li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                  a: ({ node, ...props }) => <a className="text-blue-500 hover:underline" {...props} />,
                  blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-4" {...props} />,
                  code: ({ node, inline, ...props }) => 
                    inline 
                      ? <code className="bg-gray-100 rounded px-1 py-0.5" {...props} />
                      : <pre className="bg-gray-100 rounded p-2 mb-4 overflow-x-auto"><code {...props} /></pre>,
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        )}
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
