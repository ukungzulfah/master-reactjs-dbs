import { Modal, Text, Button, Column, Container, Expanded, Positioned, Row, Widget } from "../../System/Lib/Widgets";
import { useState, useRef, useCallback } from "react";

let obj: Record<string, any> = {};
export default function ImportConfig(store: any): React.ReactElement | null {
  const dataSend = {
    store: store,
    close: () => {
      if (obj.panel && typeof obj.panel.unMounting === 'function') {
        obj.panel.unMounting();
      } else {
        console.warn("Modal or unMounting function not available on obj.panel");
      }
    },
  };

  obj.panel = Modal({
    fullscreen: true,
    onClose: () => console.log("Modal Close event triggered"),
    child: Widget(ModalImportConfig, dataSend)
  });

  return obj.panel; // return React.ReactElement
}

function ModalImportConfig(props: { store: any, close: () => void }) {
  return Positioned({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    child: Column({
      center: true,
      children: [
        Container({
          backgroundColor: "white",
          width: 600,
          height: 500,
          radius: 16,
          shadow: "0 20px 40px rgba(0,0,0,0.1)",
          child: Column({
            children: [
              // Header
              Container({
                padding: 24,
                borderBottom: "1px solid #e5e7eb",
                child: Row({
                  children: [
                    Expanded({
                      child: Text("Import Flow Configuration", {
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#1f2937"
                      })
                    }),
                    Button("✕", {
                      onClick: props.close,
                      backgroundColor: "transparent",
                      color: "#6b7280",
                      fontSize: 18,
                      padding: 8,
                      radius: 8
                    })
                  ]
                })
              }),
              // Body
              Expanded({
                child: ComponentUploadFile(props.store, props.close)
              })
            ]
          })
        })
      ]
    })
  }).builder()
}

function ComponentUploadFile(store: any, close: () => void) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setSuccess(false);
  }, []);

  const handleFileRead = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (!data.nodes || !data.edges) {
        throw new Error("Invalid file format. File must contain 'nodes' and 'edges' properties.");
      }
      
      // Update store with the imported data
      console.log(data.nodes);
      console.log(data.edges);
      store.setNodes(data.nodes);
      store.setEdges(data.edges);
      
      setSuccess(true);
      setTimeout(() => {
        close();
      }, 1500);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse file");
    } finally {
      setIsLoading(false);
    }
  }, [store, close]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile.type === "application/json" || selectedFile.name.endsWith('.json')) {
        handleFileChange(selectedFile);
      } else {
        setError("Please select a valid JSON file");
      }
    }
  }, [handleFileChange]);

  const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      handleFileChange(selectedFile);
    }
  }, [handleFileChange]);

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImport = useCallback(() => {
    if (file) {
      handleFileRead(file);
    }
  }, [file, handleFileRead]);

  return (
    <div style={{ 
      padding: '32px', 
      height: '100%', 
      width: '100%',
      display: 'flex', 
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Upload Area */}
      {!file && (<div
        style={{
          border: isDragOver ? '2px dashed #3b82f6' : '2px dashed #e5e7eb',
          backgroundColor: isDragOver ? '#f0f9ff' : '#ffffff',
          borderRadius: '16px',
          padding: '48px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          minHeight: '200px',
          position: 'relative',
          overflow: 'hidden'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDragOver 
            ? 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)' 
            : 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
          opacity: 0.5,
          zIndex: 0
        }} />
        
        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Icon */}
          <div style={{ 
            fontSize: '64px', 
            color: isDragOver ? '#3b82f6' : '#9ca3af', 
            marginBottom: '24px',
            transition: 'all 0.3s ease',
            paddingTop: '20px'
          }}>
            📁
          </div>
          
          {/* Main Text */}
          <div style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: isDragOver ? '#1e40af' : '#374151',
            textAlign: 'center',
            marginBottom: '12px',
            lineHeight: '1.4'
          }}>
            {isDragOver ? 'Drop your file here' : 'Drag and drop your JSON file here'}
          </div>
          
          {/* Subtitle */}
          <div style={{ 
            fontSize: '14px', 
            color: '#6b7280', 
            marginBottom: '24px',
            lineHeight: '1.5'
          }}>
            or
          </div>
          
          {/* Browse Button */}
          <button
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '14px 28px',
              borderRadius: '12px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              fontSize: '15px',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06)';
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleBrowseClick();
            }}
          >
            Browse Files
          </button>
          
          {/* File Type Info */}
          <div style={{ 
            fontSize: '13px', 
            color: '#9ca3af', 
            marginTop: '20px', 
            textAlign: 'center',
            fontWeight: '500'
          }}>
            Supports: .json files only
          </div>
        </div>
      </div>)}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />

      {/* File Preview */}
      {file && (
        <div style={{
          marginTop: '24px',
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{ 
            fontSize: '24px', 
            marginRight: '16px',
            color: '#0ea5e9'
          }}>
            ✅
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ 
              fontSize: '15px', 
              fontWeight: '600', 
              color: '#0c4a6e',
              marginBottom: '4px'
            }}>
              {file.name}
            </div>
            <div style={{ 
              fontSize: '13px', 
              color: '#0369a1',
              fontWeight: '500'
            }}>
              Size: {(file.size / 1024).toFixed(1)} KB
            </div>
          </div>
          <button
            style={{
              backgroundColor: 'transparent',
              color: '#dc2626',
              fontSize: '13px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #fecaca',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setFile(null)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fef2f2';
              e.currentTarget.style.borderColor = '#fca5a5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = '#fecaca';
            }}
          >
            Remove
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{
          marginTop: '20px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{ 
            fontSize: '18px', 
            marginRight: '12px',
            color: '#dc2626'
          }}>
            ❌
          </div>
          <div style={{ 
            fontSize: '14px', 
            color: '#dc2626', 
            flex: 1,
            fontWeight: '500',
            lineHeight: '1.4'
          }}>
            {error}
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div style={{
          marginTop: '20px',
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{ 
            fontSize: '18px', 
            marginRight: '12px',
            color: '#16a34a'
          }}>
            ✅
          </div>
          <div style={{ 
            fontSize: '14px', 
            color: '#16a34a', 
            flex: 1,
            fontWeight: '500',
            lineHeight: '1.4'
          }}>
            Configuration imported successfully!
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ 
        marginTop: '32px', 
        display: 'flex', 
        gap: '16px',
        paddingTop: '20px',
        borderTop: '1px solid #f3f4f6'
      }}>
        <button
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            color: '#6b7280',
            padding: '14px 24px',
            borderRadius: '12px',
            border: '1px solid #d1d5db',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          }}
          onClick={close}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f9fafb';
            e.currentTarget.style.borderColor = '#9ca3af';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = '#d1d5db';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Cancel
        </button>
        <button
          style={{
            backgroundColor: file && !isLoading ? '#3b82f6' : '#9ca3af',
            color: 'white',
            padding: '14px 24px',
            borderRadius: '12px',
            border: 'none',
            cursor: file && !isLoading ? 'pointer' : 'not-allowed',
            fontSize: '15px',
            fontWeight: '600',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: file && !isLoading 
              ? '0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06)'
              : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            opacity: file && !isLoading ? 1 : 0.6,
            flex: 1
          }}
          onClick={handleImport}
          disabled={!file || isLoading}
          onMouseEnter={(e) => {
            if (file && !isLoading) {
              e.currentTarget.style.backgroundColor = '#2563eb';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (file && !isLoading) {
              e.currentTarget.style.backgroundColor = '#3b82f6';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06)';
            }
          }}
        >
          {isLoading ? 'Importing...' : 'Import Configuration'}
        </button>
      </div>
    </div>
  );
}