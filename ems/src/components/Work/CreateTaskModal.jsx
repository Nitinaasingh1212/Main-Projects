import React, { useState, useRef } from 'react';
import { saveAttachmentFile, getCategoryMeta, deleteAttachmentFile } from '../../services/attachmentStorage';

const CreateTaskModal = ({
    users = [],
    currentUser,
    prefilledUser = null,
    onClose,
    onSubmitSuccess
}) => {
    const isPersonalTask = currentUser?.role === 'user';
    const fileInputRef = useRef(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedToId, setAssignedToId] = useState(
        prefilledUser ? prefilledUser.id : (isPersonalTask ? currentUser.id : (users[0]?.id || ''))
    );
    const [priority, setPriority] = useState('Medium');
    const [category, setCategory] = useState('General');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
    const [checklistInput, setChecklistInput] = useState('');
    const [checklistItems, setChecklistItems] = useState([
        { id: '1', text: 'Analyze requirements & scope', completed: false }
    ]);
    const [attachments, setAttachments] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectedUser = users.find(u => u.id === assignedToId) || (isPersonalTask ? currentUser : null);

    const addChecklistItem = (e) => {
        e.preventDefault();
        if (checklistInput.trim()) {
            setChecklistItems([
                ...checklistItems,
                { id: `c-${Date.now()}`, text: checklistInput.trim(), completed: false }
            ]);
            setChecklistInput('');
        }
    };

    const handleFiles = async (fileList) => {
        if (!fileList || fileList.length === 0) return;
        setIsUploading(true);
        try {
            const newAtts = [];
            for (let i = 0; i < fileList.length; i++) {
                const file = fileList[i];
                const meta = await saveAttachmentFile(file, currentUser?.name || 'Admin');
                newAtts.push(meta);
            }
            setAttachments(prev => [...prev, ...newAtts]);
        } catch (err) {
            console.error('Error uploading attachments:', err);
            alert('Failed to process file attachment.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileInputChange = (e) => {
        handleFiles(e.target.files);
        e.target.value = '';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDraggingOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleRemoveAttachment = async (attId) => {
        await deleteAttachmentFile(attId);
        setAttachments(prev => prev.filter(a => a.id !== attId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsSubmitting(true);
        try {
            const taskData = {
                title: title.trim(),
                description: description.trim(),
                assignedToId: isPersonalTask ? currentUser.id : assignedToId,
                assignedToName: selectedUser ? selectedUser.name : (isPersonalTask ? currentUser.name : 'Unassigned'),
                assignedToPosition: selectedUser ? selectedUser.position : (isPersonalTask ? currentUser.position : ''),
                assignedToDepartment: selectedUser ? selectedUser.department : (isPersonalTask ? currentUser.department : ''),
                priority,
                category: category.trim() || 'General',
                startDate,
                dueDate,
                status: 'TODO',
                checklist: checklistItems,
                attachments: attachments,
                isPersonal: isPersonalTask
            };

            await onSubmitSuccess(taskData);
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] shadow-2xl flex flex-col border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                            {isPersonalTask ? "➕ Create Personal Task" : "📋 Create & Assign Work"}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {isPersonalTask 
                                ? "Manage your own deliverables and checklist."
                                : "Assign task to a team member with deadlines and milestones."}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center text-sm font-bold transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
                    {/* Task Title */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Task Name / Title <span className="text-rose-500">*</span>
                        </label>
                        <input
                            required
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Implement Responsive Dashboard UI"
                            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 placeholder:text-slate-400 bg-slate-50/50"
                        />
                    </div>

                    {/* Assignee Selection (Hidden for normal user personal task) */}
                    {!isPersonalTask && (
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Assign To Team Member <span className="text-rose-500">*</span>
                            </label>
                            <select
                                required
                                value={assignedToId}
                                onChange={(e) => setAssignedToId(e.target.value)}
                                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 bg-white"
                            >
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>
                                        {u.name} — {u.position} ({u.department})
                                    </option>
                                ))}
                            </select>
                            {selectedUser && (
                                <p className="text-[11px] text-slate-500 mt-1">
                                    Assigned Position: <strong className="text-[#0084ff]">{selectedUser.position}</strong> • Department: {selectedUser.department}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Priority, Category, Dates Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 bg-white"
                            >
                                <option value="Low">🟢 Low</option>
                                <option value="Medium">🟡 Medium</option>
                                <option value="High">🔴 High</option>
                                <option value="Urgent">🔥 Urgent</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Category / Tag</label>
                            <input
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="e.g. Design, Frontend, Lab Experiment"
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 bg-slate-50/50"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 bg-slate-50/50"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Due Date / Deadline <span className="text-rose-500">*</span>
                            </label>
                            <input
                                required
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 bg-slate-50/50"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Description & Requirements <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                            required
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Specify deliverables, links, objectives, acceptance criteria..."
                            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 placeholder:text-slate-400 bg-slate-50/50 resize-none"
                        />
                    </div>

                    {/* Checklist Items */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Checklist Milestones</label>
                        <div className="space-y-1.5 mb-2">
                            {checklistItems.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                                    <span className="text-slate-700">{item.text}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeChecklistItem(item.id)}
                                        className="text-slate-400 hover:text-rose-600 text-xs font-bold"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={checklistInput}
                                onChange={(e) => setChecklistInput(e.target.value)}
                                placeholder="Add checklist step..."
                                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-[#0084ff] bg-slate-50/50"
                            />
                            <button
                                type="button"
                                onClick={addChecklistItem}
                                className="px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900"
                            >
                                + Add Step
                            </button>
                        </div>
                    </div>

                    {/* Attachments Upload (All Files & Videos) */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-semibold text-slate-700">
                                Attachments ({attachments.length}) — All File Types & Videos
                            </label>
                            <span className="text-[10px] text-slate-400">
                                MP4, WebM, PDF, Images, ZIP, Docs, etc.
                            </span>
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

                        {/* Drag and Drop Zone */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                            onDragLeave={() => setIsDraggingOver(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`p-4 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
                                isDraggingOver
                                    ? 'border-[#0084ff] bg-sky-50/60 ring-2 ring-sky-200'
                                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/40 hover:bg-slate-50'
                            }`}
                        >
                            {isUploading ? (
                                <div className="py-2 flex items-center justify-center gap-2 text-xs font-semibold text-[#0084ff]">
                                    <span className="animate-spin text-base">⏳</span>
                                    <span>Processing attachment...</span>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <div className="flex items-center justify-center gap-1.5 text-lg">
                                        <span>🎬</span>
                                        <span>📎</span>
                                        <span>📄</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-700">
                                        Click to browse or drag & drop files / videos here
                                    </p>
                                    <p className="text-[10px] text-slate-400">
                                        Supports all video formats (MP4, MOV, WebM), images, PDFs, spreadsheets, and archives
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Uploaded Attachments List */}
                        {attachments.length > 0 && (
                            <div className="mt-3 space-y-2 max-h-36 overflow-y-auto">
                                {attachments.map(att => {
                                    const meta = getCategoryMeta(att.category);
                                    return (
                                        <div
                                            key={att.id}
                                            className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs shadow-xs"
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                                <span className="text-base flex-shrink-0">{meta.icon}</span>
                                                <div className="min-w-0">
                                                    <span className="font-bold text-slate-800 block truncate">
                                                        {att.name}
                                                    </span>
                                                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                                        <span>{att.size}</span>
                                                        <span>•</span>
                                                        <span className={`px-1.5 py-0.2 rounded border font-semibold ${meta.bg}`}>
                                                            {meta.label}
                                                        </span>
                                                        {att.category === 'video' && (
                                                            <span className="px-1.5 py-0.2 rounded font-extrabold bg-purple-100 text-purple-700">
                                                                ▶ Video Ready
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveAttachment(att.id);
                                                }}
                                                className="w-6 h-6 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center font-bold text-xs transition-colors flex-shrink-0"
                                                title="Remove attachment"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer Submit */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 rounded-xl bg-[#0084ff] hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-sm"
                        >
                            {isSubmitting ? "Creating..." : (isPersonalTask ? "Create Personal Task" : "Assign Work")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;
