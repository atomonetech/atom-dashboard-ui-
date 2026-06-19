import React, { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const ProductionUpdateModal = ({ isOpen, onClose, formKey, recordData, onRefresh }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        achievedQty: '',
        startTime: '',
        endTime: '',
        totalWorkingTime: '',
        toolSetupTime: '',
        machineBdTime: '',
        toolBdTime: '',
        rmCoilNo: '',
        qtyRemark: ''
    });

    useEffect(() => {
        if (isOpen && recordData) {
            const actualRecord = recordData.details ? recordData.details[0] : recordData;
            
            const formatTime = (timeStr) => {
                if (!timeStr) return '';
                return timeStr.length >= 5 ? String(timeStr).substring(0, 5) : timeStr;
            };

            const rawStartTime = actualRecord['START TIME'] || actualRecord['Start Time'] || actualRecord['Prod. Start Time'] || actualRecord['production_start_time'] || '';
            const rawEndTime = actualRecord['END TIME'] || actualRecord['End Time'] || actualRecord['production_end_time'] || '';

            setFormData({
                achievedQty: actualRecord['Achieved Qty'] || actualRecord['achieved_quantity'] || '',
                startTime: formatTime(rawStartTime),
                endTime: formatTime(rawEndTime),
                totalWorkingTime: actualRecord['Total Working Time'] || actualRecord['total_working_time'] || '',
                toolSetupTime: actualRecord['Tool Setup (Min)'] || actualRecord['tool_setup_time'] || '',
                machineBdTime: actualRecord['Machine B/D Time'] || actualRecord['machine_bd_time'] || '',
                toolBdTime: actualRecord['Tool B/D Time'] || actualRecord['tool_bd_time'] || '',
                rmCoilNo: actualRecord['RM Coil No'] || actualRecord['rm_coil_no'] || '',
                qtyRemark: actualRecord['Qty Remark'] || actualRecord['qty_remark'] || ''
            });
        }
    }, [isOpen, recordData]);

    const calculateWorkingTime = (start, end) => {
        if (!start || !end) return "";

        const [startH, startM] = start.split(":").map(Number);
        const [endH, endM] = end.split(":").map(Number);

        let startMinutes = startH * 60 + startM;
        let endMinutes = endH * 60 + endM;

        if (endMinutes <= startMinutes) {
            endMinutes += 24 * 60;
        }

        const diffMinutes = endMinutes - startMinutes;
        const hours = Math.floor(diffMinutes / 60);
        const mins = diffMinutes % 60;

        if (mins === 0) {
            return `${hours} hrs`;
        } else {
            return `${hours} hrs ${mins} mins`;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "startTime" || name === "endTime") {
            const start = name === "startTime" ? value : formData.startTime;
            const end = name === "endTime" ? value : formData.endTime;
            
            const totalWorkingTime = calculateWorkingTime(start, end);

            setFormData(prev => ({
                ...prev,
                [name]: value,
                totalWorkingTime: totalWorkingTime || prev.totalWorkingTime
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        //  Logic to find the ID
        let recordId = null;
        if (recordData?.id) recordId = recordData.id;
        else if (recordData?.ID) recordId = recordData.ID;
        else if (recordData?.record_id) recordId = recordData.record_id;
        else if (recordData?.details && recordData.details.length > 0) {
            const firstDetail = recordData.details[0];
            recordId = firstDetail.id || firstDetail.ID || firstDetail.record_id;
        }

        if (!recordId) {
            console.error("ERROR: Record ID not found! Here is the complete recordData:", recordData);
            alert("Record ID missing! Please check the developer console.");
            setIsSubmitting(false);
            return;
        }

        const payload = {
            achieved_quantity: formData.achievedQty,
            production_start_time: formData.startTime,
            production_end_time: formData.endTime,
            total_working_time: formData.totalWorkingTime,
            tool_setup_time: formData.toolSetupTime,
            machine_bd_time: formData.machineBdTime,
            tool_bd_time: formData.toolBdTime,
            rm_coil_no: formData.rmCoilNo,
            qty_remark: formData.qtyRemark
        };

        try {
            //  Applied fix here to match Django URLs
            let targetUrl = '';
            if (formKey === 'daily-prod-plan') {
                targetUrl = `${API_BASE_URL}/api/update-daily-production/${recordId}/`;
            } else {
                targetUrl = `${API_BASE_URL}/api/production-data/${formKey}/${recordId}/`;
            }

            const response = await fetch(targetUrl, {
                method: 'PATCH', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Production record updated successfully!");
                onRefresh(); // The table in the background will update as soon as the modal saves
                onClose();   // Close the modal
            } else {
                const errorData = await response.json();
                alert(`Failed to update: ${errorData.message || 'Server Error'}`);
            }
        } catch (error) {
            console.error("Update Error:", error);
            alert("Network error while updating record.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const machineNo = recordData?.headerRow ? recordData.headerRow['Machine No'] : recordData['Machine No'];
    const partName = recordData?.headerRow ? recordData.headerRow['Part Name'] : recordData['Part Name'];

    return (
        <div className="upd-overlay">
            <style>{`
                .upd-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 999999; animation: fadeIn 0.2s ease; }
                .upd-modal { background: #fff; width: 100%; max-width: 600px; border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); overflow: hidden; display: flex; flex-direction: column; max-height: 90vh; }
                
                .upd-header { background: #f8fafc; padding: 20px 24px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: flex-start; }
                .upd-title { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
                .upd-subtitle { font-size: 0.8rem; font-weight: 600; color: #3b82f6; display: flex; gap: 10px; }
                .upd-close { background: #e2e8f0; border: none; width: 32px; height: 32px; border-radius: 8px; color: #64748b; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
                .upd-close:hover { background: #ef4444; color: white; }

                .upd-body { padding: 24px; overflow-y: auto; }
                
                .upd-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
                .upd-form-group { display: flex; flex-direction: column; gap: 6px; }
                .upd-form-group.full-width { grid-column: span 2; }
                
                .upd-label { font-size: 0.75rem; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
                .upd-input { padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.9rem; font-weight: 600; color: #1e293b; outline: none; transition: 0.2s; background: #f8fafc; }
                .upd-input:focus { border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }

                .upd-footer { padding: 16px 24px; border-top: 1px solid #e2e8f0; background: #f8fafc; display: flex; justify-content: flex-end; gap: 12px; }
                .btn-cancel { padding: 10px 20px; border-radius: 10px; font-weight: 700; font-size: 0.85rem; border: 1px solid #cbd5e1; background: #fff; color: #64748b; cursor: pointer; transition: 0.2s; }
                .btn-cancel:hover { background: #f1f5f9; color: #0f172a; }
                .btn-save { padding: 10px 24px; border-radius: 10px; font-weight: 700; font-size: 0.85rem; border: none; background: #3b82f6; color: #fff; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 8px; }
                .btn-save:hover { background: #2563eb; transform: translateY(-1px); }
                .btn-save:disabled { background: #94a3b8; cursor: not-allowed; transform: none; }
            `}</style>

            <div className="upd-modal" onClick={e => e.stopPropagation()}>
                
                <div className="upd-header">
                    <div>
                        <div className="upd-title">Update Production Details</div>
                        <div className="upd-subtitle">
                            <span><i className="bi bi-gear-fill me-1"></i> {machineNo || 'Machine'}</span>
                            <span>•</span>
                            <span><i className="bi bi-box-seam me-1"></i> {partName || 'Part'}</span>
                        </div>
                    </div>
                    <button className="upd-close" onClick={onClose}><i className="bi bi-x-lg"></i></button>
                </div>

                <div className="upd-body">
                    {formKey === 'daily-prod-plan' ? (
                        <form id="updateForm" onSubmit={handleSubmit}>
                            <div className="upd-form-grid">
                                
                                <div className="upd-form-group">
                                    <label className="upd-label">Achieved Qty.</label>
                                    <input type="number" name="achievedQty" className="upd-input" 
                                        placeholder="Actual quantity" value={formData.achievedQty} onChange={handleChange} />
                                </div>

                                <div className="upd-form-group">
                                    <label className="upd-label">Total Working Time</label>
                                    <input type="text" name="totalWorkingTime" className="upd-input" 
                                        placeholder="e.g. 8 hrs" value={formData.totalWorkingTime} onChange={handleChange} />
                                </div>
                                
                                <div className="upd-form-group">
                                    <label className="upd-label">Prod. Start Time</label>
                                    <input type="time" name="startTime" className="upd-input" 
                                        value={formData.startTime} onChange={handleChange} />
                                </div>

                                <div className="upd-form-group">
                                    <label className="upd-label">Prod. End Time</label>
                                    <input type="time" name="endTime" className="upd-input" 
                                        value={formData.endTime} onChange={handleChange} />
                                </div>

                                <div className="upd-form-group">
                                    <label className="upd-label">Tool Set-up Time</label>
                                    <input type="number" name="toolSetupTime" className="upd-input" 
                                        placeholder="In minutes" value={formData.toolSetupTime} onChange={handleChange} />
                                </div>

                                <div className="upd-form-group">
                                    <label className="upd-label">Machine B/D Time</label>
                                    <input type="number" name="machineBdTime" className="upd-input" 
                                        placeholder="In minutes" value={formData.machineBdTime} onChange={handleChange} />
                                </div>

                                <div className="upd-form-group">
                                    <label className="upd-label">Tool B/D Time</label>
                                    <input type="number" name="toolBdTime" className="upd-input" 
                                        placeholder="In minutes" value={formData.toolBdTime} onChange={handleChange} />
                                </div>

                                <div className="upd-form-group">
                                    <label className="upd-label">RM Coil / Lot No.</label>
                                    <input type="text" name="rmCoilNo" className="upd-input" 
                                        placeholder="Enter lot or coil number" value={formData.rmCoilNo} onChange={handleChange} />
                                </div>

                                <div className="upd-form-group full-width">
                                    <label className="upd-label">Qty. Remark</label>
                                    <input type="text" name="qtyRemark" className="upd-input" 
                                        placeholder="Any remarks?" value={formData.qtyRemark} onChange={handleChange} />
                                </div>

                            </div>
                        </form>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748b' }}>
                            <i className="bi bi-tools" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                            <p style={{ fontWeight: 600 }}>Update form for <b>{formKey}</b> is under development.</p>
                        </div>
                    )}
                </div>

                <div className="upd-footer">
                    <button type="button" className="btn-cancel" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </button>
                    {formKey === 'daily-prod-plan' && (
                        <button type="submit" form="updateForm" className="btn-save" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <><span className="spinner-border spinner-border-sm"></span> Saving...</>
                            ) : (
                                <><i className="bi bi-check2-circle"></i> Save Updates</>
                            )}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ProductionUpdateModal;