import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import MDEditor from '@uiw/react-md-editor';
import ReactMarkdown from 'react-markdown';
import { Bold, Italic, Link, List, ListOrdered } from 'lucide-react';
import { useTheme } from 'next-themes';

const templates = [
  { id: 'blank', name: 'Blank Document', content: '# Start your compliance document here' },
  { id: 'compliance-checklist', name: 'Compliance Checklist', content: `# 🔍 Compliance Checklist

## 📋 Overview
Use this checklist to ensure all compliance requirements are met.

---

## 🔐 Data Protection
- [ ] Encrypt sensitive data
- [ ] Implement access controls
- [ ] Regular security audits

---

## 📜 Policy Compliance
- [ ] Review and update policies
- [ ] Employee training completed
- [ ] Documentation up to date

---

## 🌐 Regulatory Requirements
- [ ] GDPR compliance
- [ ] HIPAA compliance (if applicable)
- [ ] Industry-specific regulations

---

## 🔄 Continuous Monitoring
- [ ] Implement automated compliance checks
- [ ] Schedule regular compliance meetings
- [ ] Track and resolve compliance issues

---

## 📊 Reporting
- [ ] Generate compliance reports
- [ ] Review with stakeholders
- [ ] Action plan for any gaps

> **Note:** Customize this checklist based on your specific compliance needs.
` },
  { id: 'incident-response-plan', name: 'Incident Response Plan', content: `# 🚨 Incident Response Plan

## 1. 🎯 Objective
Provide a structured approach to handling security incidents.

## 2. 📞 Emergency Contacts
| Role | Name | Contact |
|------|------|---------|
| IT Security | John Doe | 555-0123 |
| Legal | Jane Smith | 555-0456 |
| PR | Bob Johnson | 555-0789 |

## 3. 🔍 Incident Classification
- **Level 1:** Minor - No data breach
- **Level 2:** Moderate - Potential data exposure
- **Level 3:** Critical - Confirmed data breach

## 4. 📈 Response Workflow
\`\`\`mermaid
graph TD
    A[Detect Incident] --> B{Assess Severity}
    B --> C[Level 1]
    B --> D[Level 2]
    B --> E[Level 3]
    C --> F[Contain & Resolve]
    D --> G[Activate Response Team]
    E --> H[Full Emergency Response]
    F --> I[Document & Report]
    G --> I
    H --> I
    I --> J[Review & Improve]
\`\`\`

## 5. 📝 Documentation
- Incident details
- Actions taken
- Evidence collected

## 6. 📊 Post-Incident Analysis
- Root cause analysis
- Lessons learned
- Update procedures

> **Remember:** Quick and coordinated response is key to minimizing impact.
` },
  { id: 'compliance-training', name: 'Compliance Training Module', content: `# 🎓 Compliance Training Module

## 📚 Module Overview

This training module covers key compliance areas for all employees.

---

## 🔑 Key Topics

1. **Ethics and Code of Conduct**
   - Company values
   - Ethical decision-making

2. **Data Privacy**
   - Handling sensitive information
   - GDPR basics

3. **Information Security**
   - Password best practices
   - Phishing awareness

4. **Anti-Discrimination and Harassment**
   - Recognizing inappropriate behavior
   - Reporting procedures

---

## 💡 Interactive Elements

- **Quiz:** Test your knowledge
- **Case Studies:** Apply concepts to real scenarios
- **Role-Playing:** Practice handling compliance situations

---

## 📅 Training Schedule

| Topic | Date | Duration |
|-------|------|----------|
| Ethics | Jan 15 | 1 hour |
| Data Privacy | Jan 22 | 2 hours |
| Info Security | Jan 29 | 1.5 hours |
| Anti-Discrimination | Feb 5 | 1 hour |

---

## 🏆 Certification

Complete all modules and pass the final assessment to receive your compliance certification.

> **Note:** Compliance is everyone's responsibility. Stay informed and vigilant!
` },
];

const DocumentWrite = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(templates[0].content);
  const [recipient, setRecipient] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
  const { theme } = useTheme();

  useEffect(() => {
    const template = templates.find(t => t.id === selectedTemplate);
    if (template) {
      setContent(template.content);
    }
  }, [selectedTemplate]);

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
    <div className="container mx-auto p-4 max-w-2xl bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">Create New Document</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div>
            <label htmlFor="template" className="block text-sm font-medium mb-1">Template</label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="bg-secondary">
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title"
              required
              className="bg-secondary"
            />
          </div>
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
                a: ({ node, ...props }) => <a className="text-primary hover:underline" {...props} />,
                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-border pl-4 italic mb-4" {...props} />,
                code: ({ node, inline, ...props }) => 
                  inline 
                    ? <code className="bg-secondary rounded px-1 py-0.5" {...props} />
                    : <pre className="bg-secondary rounded p-2 mb-4 overflow-x-auto"><code {...props} /></pre>,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium mb-1">Recipient</label>
          <Select onValueChange={setRecipient} required>
            <SelectTrigger className="bg-secondary">
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
        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Create Document</Button>
      </form>
    </div>
  );
};

export default DocumentWrite;
