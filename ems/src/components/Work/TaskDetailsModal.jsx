import React, { useState, useRef } from 'react';
import {
    saveAttachmentFile,
    getAttachmentUrl,
    downloadAttachment,
    deleteAttachmentFile,
    getFileCategory,
    getCategoryMeta
} from '../../services/attachmentStorage';

const TaskDetailsModal = ({
    task,
    currentUser,
    onClose,
    onStatusChange,
    onToggleChecklist,
    onAddChecklistItem,
    onAddComment,
    onAddAttachment,
    onDeleteAttachment,
    onDeleteTask
}) => {
    if (!task) return null;

    const fileInputRef = useRef(null);
    const [newChecklistText, setNewChecklistText] = useState('');
    const [newCommentText, setNewCommentText] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [previewMedia, setPreviewMedia] = useState(null);
    const [previewLoading, setPreviewLoading] = useState(false);

    const isAdmin = currentUser?.role === 'main_admin' || currentUser?.role === 'secondary_admin';
    const isAssignee = task.assignedToId === currentUser?.id;
    const canEditChecklist = isAssignee || isAdmin;
    const canComment = true;

    const handleAddChecklist = (e) => {
        e.preventDefault();
        if (newChecklistText.trim() && onAddChecklistItem) {
            onAddChecklistItem(task.id, newChecklistText.trim());
            setNewChecklistText('');
        }
    };

    const handleAddComment = (e) => {
        e.preventDefault();
        if (newCommentText.trim() && onAddComment) {
            onAddComment(task.id, currentUser.name, currentUser.roleLabel || currentUser.role, newCommentText.trim());
            setNewCommentText('');
        }
    };

    const handleUploadFiles = async (fileList) => {
        if (!fileList || fileList.length === 0) return;
        setIsUploading(true);
        try {
            for (let i = 0; i < fileList.length; i++) {
                const file = fileList[i];
                const meta = await saveAttachmentFile(file, currentUser?.name || 'Member');
                if (onAddAttachment) {
                    onAddAttachment(task.id, meta);
                }
            }
        } catch (err) {
            console.error('Error uploading attachment:', err);
            alert('Failed to upload file attachment.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileInputChange = (e) => {
        handleUploadFiles(e.target.files);
        e.target.value = '';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDraggingOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleUploadFiles(e.dataTransfer.files);
        }
    };

    const handlePreviewMedia = async (att) => {
        const category = att.category || getFileCategory(att.mimeType, att.name);
        setPreviewLoading(true);
        try {
            const url = await getAttachmentUrl(att);
            setPreviewMedia({
                id: att.id,
                name: att.name,
                category,
                size: att.size,
                uploadedBy: att.uploadedBy,
                date: att.date,
                url
            });
        } catch (err) {
            console.error('Error previewing media:', err);
            alert('Could not preview attachment.');
        } finally {
            setPreviewLoading(false);
        }
    };

    const handleDownload = async (att) => {
        try {
            await downloadAttachment(att);
        } catch (err) {
            console.error('Download error:', err);
            alert('Could not download file.');
        }
    };

    const handleDeleteAtt = async (att) => {
        if (window.confirm(`Are you sure you want to delete "${att.name}"?`)) {
            await deleteAttachmentFile(att.id);
            if (onDeleteAttachment) {
                onDeleteAttachment(task.id, att.id);
            }
            if (previewMedia?.id === att.id) {
                setPreviewMedia(null);
            }
        }
    };

    const handleQuickStatus = (newStatus, feedback = '') => {
        if (onStatusChange) {
            onStatusChange(task.id, newStatus, feedback);
        }
        setShowReworkPrompt(false);
        setShowSubmitPrompt(false);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'TODO':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">TODO</span>;
            case 'IN_PROGRESS':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">IN PROGRESS</span>;
            case 'COMPLETED':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">COMPLETED</span>;
            case 'REWORK':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">REWORK REQUIRED</span>;
            default:
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100">{status}</span>;
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] shadow-2xl flex flex-col border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/70 flex items-start justify-between">
                    <div className="space-y-1.5 flex-1 pr-4">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                                #{task.category}
                            </span>
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                                task.priority === 'Urgent' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                task.priority === 'High' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                'bg-sky-50 text-[#0084ff] border border-sky-200'
                            }`}>
                                {task.priority} Priority
                            </span>
                            {getStatusBadge(task.status)}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">{task.title}</h3>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center text-sm font-bold transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    {/* Rework Alert if any */}
                    {task.status === 'REWORK' && task.reviewFeedback && (
                        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 space-y-1">
                            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-rose-700">
                                <span>⚠️ Admin Rework Requested</span>
                            </div>
                            <p className="text-xs">{task.reviewFeedback}</p>
                            <p className="text-[11px] text-rose-500 mt-1">Please address the feedback and move back to In Progress.</p>
                        </div>
                    )}

                    {/* Submission notes if submitted */}
                    {task.submissionNotes && (
                        <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 space-y-1">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
                                📝 Member Submission Notes:
                            </div>
                            <p className="text-xs">{task.submissionNotes}</p>
                        </div>
                    )}

                    {/* Meta info bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Assigned To</span>
                            <span className="font-bold text-slate-800">{task.assignedToName}</span>
                            <span className="text-[10px] text-slate-500 block truncate">{task.assignedToPosition}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Assigned By</span>
                            <span className="font-bold text-slate-800">{task.assignedByName || 'Admin'}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Start Date</span>
                            <span className="font-semibold text-slate-700">{task.startDate}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Due Date</span>
                            <span className="font-bold text-slate-800">{task.dueDate}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
                        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 whitespace-pre-line">
                            {task.description || "No description provided."}
                        </p>
                    </div>

                    {/* Interactive Checklist */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Checklist ({task.checklist?.filter(c => c.completed).length || 0} / {task.checklist?.length || 0})
                            </h4>
                        </div>

                        <div className="space-y-2">
                            {(task.checklist || []).map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => canEditChecklist && onToggleChecklist && onToggleChecklist(task.id, item.id)}
                                    className={`p-2.5 rounded-xl border flex items-center gap-3 transition-colors ${
                                        canEditChecklist ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default'
                                    } ${item.completed ? 'bg-slate-50/80 border-slate-200 text-slate-400' : 'bg-white border-slate-200 text-slate-800'}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={item.completed}
                                        readOnly
                                        className="rounded text-[#0084ff] focus:ring-0 cursor-pointer pointer-events-none"
                                    />
                                    <span className={`text-xs font-medium ${item.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                        {item.text}
                                    </span>
                                </div>
                            ))}

                            {canEditChecklist && (
                                <form onSubmit={handleAddChecklist} className="flex gap-2 pt-1">
                                    <input
                                        type="text"
                                        value={newChecklistText}
                                        onChange={(e) => setNewChecklistText(e.target.value)}
                                        placeholder="+ Add checklist item..."
                                        className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-[#0084ff] bg-slate-50/50"
                                    />
                                    <button
                                        type="submit"
                                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl"
                                    >
                                        Add
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Attachments & Deliverables */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <span>📎 Attachments & Media</span>
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                                    {task.attachments?.length || 0}
                                </span>
                            </h4>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 text-[#0084ff] text-[11px] font-bold transition-all flex items-center gap-1"
                            >
                                <span>+ Upload File / Video</span>
                            </button>
                        </div>

                        {/* Hidden file input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileInputChange}
                            multiple
                            accept="*/*"
                            className="hidden"
                        />

                        {/* Drag and Drop Box */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                            onDragLeave={() => setIsDraggingOver(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`p-3 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all mb-3 ${
                                isDraggingOver
                                    ? 'border-[#0084ff] bg-sky-50/70 ring-2 ring-sky-200'
                                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/40 hover:bg-slate-50'
                            }`}
                        >
                            {isUploading ? (
                                <div className="py-1 flex items-center justify-center gap-2 text-xs font-semibold text-[#0084ff]">
                                    <span className="animate-spin">⏳</span>
                                    <span>Processing attachment...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                                    <span className="text-base">🎬</span>
                                    <span>Drag & drop any files or videos here, or </span>
                                    <span className="font-bold text-[#0084ff] underline">browse</span>
                                </div>
                            )}
                        </div>

                        {/* Attachments List */}
                        <div className="space-y-2">
                            {(!task.attachments || task.attachments.length === 0) ? (
                                <p className="text-xs text-slate-400 italic py-2 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                                    No attachments uploaded yet. Upload deliverables, videos, or design files above.
                                </p>
                            ) : (
                                task.attachments.map(att => {
                                    const category = att.category || getFileCategory(att.mimeType, att.name);
                                    const meta = getCategoryMeta(category);
                                    const isVideo = category === 'video';
                                    const isImage = category === 'image';
                                    const canDelete = isAdmin || isAssignee || att.uploadedBy === currentUser?.name;

                                    return (
                                        <div
                                            key={att.id}
                                            className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-xs flex items-center justify-between gap-3 group"
                                        >
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl flex-shrink-0">
                                                    {meta.icon}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-slate-900 truncate block">
                                                            {att.name}
                                                        </span>
                                                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold border ${meta.bg}`}>
                                                            {meta.label}
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] text-slate-400 block mt-0.5">
                                                        {att.size || '1.5 MB'} • uploaded by <strong className="text-slate-600">{att.uploadedBy}</strong> on {att.date}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action buttons */}
                                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                                {isVideo && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handlePreviewMedia(att)}
                                                        disabled={previewLoading}
                                                        className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-bold text-[11px] transition-colors flex items-center gap-1"
                                                    >
                                                        <span>▶</span>
                                                        <span>Watch Video</span>
                                                    </button>
                                                )}

                                                {isImage && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handlePreviewMedia(att)}
                                                        disabled={previewLoading}
                                                        className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 text-[#0084ff] font-bold text-[11px] transition-colors flex items-center gap-1"
                                                    >
                                                        <span>👁️</span>
                                                        <span>View</span>
                                                    </button>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() => handleDownload(att)}
                                                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors flex items-center gap-1"
                                                    title="Download file"
                                                >
                                                    <span>⬇</span>
                                                    <span>Download</span>
                                                </button>

                                                {canDelete && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteAtt(att)}
                                                        className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center font-bold text-xs transition-colors"
                                                        title="Delete attachment"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Comments & Discussion */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Discussion & Activity ({task.comments?.length || 0})
                        </h4>
                        <div className="space-y-2.5 max-h-48 overflow-y-auto mb-3">
                            {(task.comments || []).length === 0 ? (
                                <p className="text-xs text-slate-400 italic">No comments yet.</p>
                            ) : (
                                (task.comments || []).map(cm => (
                                    <div key={cm.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                                        <div className="flex items-center justify-between text-[11px]">
                                            <span className="font-bold text-slate-800">
                                                {cm.authorName} <span className="text-slate-400 font-normal">({cm.authorRole})</span>
                                            </span>
                                            <span className="text-slate-400">{cm.timestamp}</span>
                                        </div>
                                        <p className="text-xs text-slate-700">{cm.text}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        {canComment && (
                            <form onSubmit={handleAddComment} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newCommentText}
                                    onChange={(e) => setNewCommentText(e.target.value)}
                                    placeholder="Write a comment or update..."
                                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-[#0084ff] bg-slate-50/50"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#0084ff] hover:bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-sm"
                                >
                                    Comment
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Action Controls & Workflow Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        {isAdmin && onDeleteTask && (
                            <button
                                onClick={() => {
                                    if (window.confirm("Are you sure you want to delete this task?")) {
                                        onDeleteTask(task.id);
                                        onClose();
                                    }
                                }}
                                className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-semibold transition-colors"
                            >
                                Delete Task
                            </button>
                        )}
                    </div>

                    {/* Role-Aware Workflow Action Buttons */}
                    <div className="flex items-center gap-2">
                        {/* Start Work Action */}
                        {(isAssignee || isAdmin) && task.status === 'TODO' && (
                            <button
                                onClick={() => handleQuickStatus('IN_PROGRESS')}
                                className="px-4 py-2 rounded-xl bg-[#0084ff] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-sm"
                            >
                                Start Work ⚡
                            </button>
                        )}

                        {/* Complete Work Action */}
                        {(isAssignee || isAdmin) && (task.status === 'IN_PROGRESS' || task.status === 'REWORK' || task.status === 'SUBMITTED' || task.status === 'REVIEW') && (
                            <button
                                onClick={() => handleQuickStatus('COMPLETED')}
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                            >
                                ✓ Mark as Completed
                            </button>
                        )}

                        {/* Reopen Action */}
                        {task.status === 'COMPLETED' && (
                            <button
                                onClick={() => handleQuickStatus('IN_PROGRESS')}
                                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                            >
                                ↺ Reopen Task
                            </button>
                        )}

                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>

            {/* Media Preview & Video Player Modal */}
            {previewMedia && (
                <div
                    className="fixed inset-0 z-70 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
                    onClick={() => setPreviewMedia(null)}
                >
                    <div
                        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] shadow-2xl flex flex-col overflow-hidden text-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0 pr-4">
                                <span className="text-2xl">
                                    {getCategoryMeta(previewMedia.category).icon}
                                </span>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-bold text-white truncate max-w-md">{previewMedia.name}</h4>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${getCategoryMeta(previewMedia.category).bg}`}>
                                            {getCategoryMeta(previewMedia.category).label}
                                        </span>
                                    </div>
                                    <span className="text-[11px] text-slate-400 block mt-0.5">
                                        {previewMedia.size} • uploaded by {previewMedia.uploadedBy} on {previewMedia.date}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                    onClick={() => handleDownload(previewMedia)}
                                    className="px-3.5 py-2 rounded-xl bg-[#0084ff] hover:bg-blue-600 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                                >
                                    <span>⬇</span>
                                    <span>Download</span>
                                </button>
                                <button
                                    onClick={() => setPreviewMedia(null)}
                                    className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Media Player / Viewer */}
                        <div className="p-4 sm:p-6 flex items-center justify-center bg-black min-h-[320px] max-h-[72vh] overflow-auto">
                            {previewMedia.category === 'video' && (
                                <video
                                    src={previewMedia.url}
                                    controls
                                    autoPlay
                                    playsInline
                                    className="w-full max-h-[68vh] object-contain rounded-xl shadow-2xl"
                                >
                                    Your browser does not support HTML5 video streaming.
                                </video>
                            )}

                            {previewMedia.category === 'image' && (
                                <img
                                    src={previewMedia.url}
                                    alt={previewMedia.name}
                                    className="max-w-full max-h-[68vh] object-contain rounded-xl shadow-2xl"
                                />
                            )}

                            {previewMedia.category === 'audio' && (
                                <div className="w-full p-8 text-center space-y-4">
                                    <span className="text-5xl block">🎵</span>
                                    <h5 className="text-sm font-bold text-white">{previewMedia.name}</h5>
                                    <audio controls src={previewMedia.url} className="w-full max-w-md mx-auto" />
                                </div>
                            )}

                            {previewMedia.category !== 'video' && previewMedia.category !== 'image' && previewMedia.category !== 'audio' && (
                                <div className="text-center p-8 space-y-3">
                                    <span className="text-6xl block">📄</span>
                                    <h5 className="text-base font-bold text-white">{previewMedia.name}</h5>
                                    <p className="text-xs text-slate-400">
                                        This file ({previewMedia.size}) is ready for download.
                                    </p>
                                    <button
                                        onClick={() => handleDownload(previewMedia)}
                                        className="px-5 py-2.5 rounded-xl bg-[#0084ff] hover:bg-blue-600 text-white font-bold text-xs shadow-md transition-colors"
                                    >
                                        ⬇ Download {previewMedia.name}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskDetailsModal;
