import React, { useState } from 'react';

export interface ConfirmationModalProps {
  isOpen: boolean;
  assignmentTitle: string;
  driveLink: string;
  onClose: () => void;
  onConfirm: (submissionData: { fileOrUrl: string; note: string }) => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  assignmentTitle,
  driveLink,
  onClose,
  onConfirm,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [submissionNote, setSubmissionNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleCancelOrReset = () => {
    setStep(1);
    setSubmissionUrl('');
    setFileName('');
    setSubmissionNote('');
    setErrorMsg('');
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setSubmissionUrl(`Uploaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      setErrorMsg('');
    }
  };

  const handleFirstStep = () => {
    if (!submissionUrl.trim() && !fileName) {
      setErrorMsg('Please paste your Google Drive link or select a file to submit.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleFinalSubmit = () => {
    onConfirm({
      fileOrUrl: submissionUrl.trim() || fileName,
      note: submissionNote.trim(),
    });
    handleCancelOrReset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
        {step === 1 ? (
          <div>
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg font-bold mb-4">
              📤
            </div>
            <h3 className="text-lg font-bold text-slate-900">Submit Assignment</h3>
            <p className="text-sm text-slate-600 mt-1">
              Submitting for <span className="font-semibold text-slate-800">"{assignmentTitle}"</span>
            </p>

            {/* Reference Assignment Link */}
            <div className="my-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Instructor Drive Folder:
              </span>
              <a
                href={driveLink}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-medium truncate"
              >
                {driveLink} ↗
              </a>
            </div>

            {/* Input 1: Student Drive Link */}
            <div className="space-y-3 my-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Google Drive or GitHub Link:
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/..."
                  value={submissionUrl}
                  onChange={(e) => {
                    setSubmissionUrl(e.target.value);
                    setErrorMsg('');
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="h-[1px] bg-slate-200 flex-1"></div>
                <span className="text-[11px] text-slate-400 font-semibold uppercase">OR UPLOAD FILE</span>
                <div className="h-[1px] bg-slate-200 flex-1"></div>
              </div>

              {/* Input 2: File Picker */}
              <div>
                <input
                  type="file"
                  id="student-file-picker"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="student-file-picker"
                  className="block text-center cursor-pointer py-2.5 px-3 rounded-xl border border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 text-xs font-medium text-slate-700 transition"
                >
                  {fileName ? `✓ Selected: ${fileName}` : '📎 Pick local file from your PC (PDF, ZIP, DOC)'}
                </label>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-600 font-medium mb-3">{errorMsg}</p>
            )}

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelOrReset}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFirstStep}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-sm"
              >
                Yes, I have submitted
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-lg font-bold mb-4">
              !
            </div>
            <h3 className="text-lg font-bold text-slate-900">Final Confirmation</h3>
            <p className="text-sm text-slate-600 mt-1">
              Please double check that you have attached the correct link or file before locking the submission.
            </p>

            <div className="my-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
              <p className="font-semibold text-slate-900 mb-0.5">Attached Submission:</p>
              <p className="truncate text-indigo-600 font-medium">{submissionUrl || fileName}</p>
            </div>

            <div className="my-3">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Remark / Note for Instructor (Optional)
              </label>
              <input
                type="text"
                value={submissionNote}
                onChange={(e) => setSubmissionNote(e.target.value)}
                placeholder="e.g. Completed all stretch goals"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-sm"
              >
                Confirm Submission
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};