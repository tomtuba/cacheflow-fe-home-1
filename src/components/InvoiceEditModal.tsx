import DatePicker from "react-date-picker";
import {capitalizeFirstLetter, showCurrency} from "../utilities/converters";
import {FaEraser, FaPlus, FaSave, FaUndo} from "react-icons/fa";
import Modal from "react-modal";
import React, {ChangeEvent, useEffect, useState} from "react";
import {defaultInvoiceLine, Invoice, InvoiceLine, InvoiceStatus} from "../models/Invoice";
import {Value} from "react-date-picker/dist/cjs/shared/types";
import {InvoiceLineEditComponent} from "./InvoiceLineEditComponent";
import {validateInvoice} from "../utilities/validators";

export interface InvoiceEditModalProps {
    editedInvoice: Invoice | undefined;
    setEditedInvoice: (invoice: Invoice | undefined) => void;
    updateInvoice: (invoice: Invoice) => void;
    errors: string[];
}

export function InvoiceEditModal({editedInvoice, setEditedInvoice, updateInvoice}: InvoiceEditModalProps) {

    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        revalidate();
    }, [editedInvoice])

    const handleUpdate = (event: ChangeEvent<HTMLInputElement>) => {
        if (editedInvoice && event?.target?.value !== undefined) {
            setEditedInvoice({...editedInvoice, [event?.target?.name]: event?.target?.value});
        }
    }

    const revalidate = () => {
        if (editedInvoice) {
            const currentErrors = validateInvoice(editedInvoice);

            setErrors(currentErrors);
        }
    }

    const handleDateUpdate = (value: Value) => {
        if (editedInvoice && value) {
            setEditedInvoice({...editedInvoice, due_date: value as Date});
        }
    }

    const addInvoiceLine = () => {
        if (editedInvoice) {
            const newInvoiceLine = defaultInvoiceLine();
            setEditedInvoice({...editedInvoice, details: [...editedInvoice?.details, newInvoiceLine]});
        }
    }

    const removeInvoiceLine = (invoiceLineId: string) => {
        if (editedInvoice) {
            setEditedInvoice({
                ...editedInvoice,
                details: [...editedInvoice?.details.filter((invoice) => invoice.id !== invoiceLineId)]
            });
        }
    }

    const setInvoiceLine = (invoiceLine: InvoiceLine | undefined) => {
        if (editedInvoice && invoiceLine) {
            const ids = editedInvoice.details?.map((detail) => detail.id);
            const linesById = new Map(editedInvoice.details?.map((detail) => [detail.id, detail]));
            linesById.set(invoiceLine.id, invoiceLine);
            const updatedLines = ids.map((id) => linesById.get(id)!);
            const total = updatedLines.reduce((total, line) => total + line.quantity * line.amount, 0);
            setEditedInvoice({...editedInvoice, details: updatedLines, total});
        }
    }

    const saveInvoice = () => {
        if (editedInvoice) {
            revalidate();

            if (errors.length === 0) {
                updateInvoice(editedInvoice);
            }
        }
    }

    return (
        <Modal
            isOpen={editedInvoice?.status === InvoiceStatus.DRAFT }
            className="bg-gray-200 m-8 p-4"
        >
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1 p-2 border border-gray-400 rounded w-full shadow">

                    {/* Invoice Data */}
                    <div className="text-lg font-bold">Invoice Data:</div>
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                Customer Email
                            </td>
                            <td>
                                <input type="email" name="customer_email"
                                       value={editedInvoice?.customer_email}
                                       onChange={handleUpdate}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Customer Name
                            </td>
                            <td>
                                <input type="text" name="customer_name"
                                       value={editedInvoice?.customer_name}
                                       onChange={handleUpdate}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Description
                            </td>
                            <td>
                                <input type="text" name="description"
                                       value={editedInvoice?.description}
                                       onChange={handleUpdate}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Due Date
                            </td>
                            <td>
                                <DatePicker value={editedInvoice?.due_date} onChange={handleDateUpdate}></DatePicker>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Status
                            </td>
                            <td>
                                <div>{capitalizeFirstLetter(editedInvoice?.status)}</div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Total
                            </td>
                            <td>
                                {/* The invoice total is calculated based on the line detail */}
                                <div className="text-right">{showCurrency(editedInvoice?.total)}</div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                {/* Invoice Details */}
                <div className="flex flex-col gap-1 p-2 border border-gray-400 rounded w-full shadow">
                    <div className="text-lg font-bold">Invoice Details:</div>
                    <button onClick={addInvoiceLine}
                            className="border border-gray-400 rounded shadow px-2 mr-auto">
                        <div className="flex flex-row gap-2 align-middle items-center">
                            <FaPlus aria-label="Add Invoice Detail"/>
                            <div>Add Invoice Detail</div>
                        </div>
                    </button>
                    <table>
                        <tbody>
                        <tr>
                            <th>{/* Empty column header - for Remove button */}</th>
                            <th>
                                <div className="text-left">Quantity</div>
                            </th>
                            <th>
                                <div className="text-left">Description</div>
                            </th>
                            <th>
                                <div className="text-left">Amount</div>
                            </th>
                            <th>
                                <div className="text-left">Line Total</div>
                            </th>
                        </tr>
                        {editedInvoice?.details.map((invoiceLine) => (
                            <InvoiceLineEditComponent invoiceLine={invoiceLine}
                                                      setInvoiceLine={setInvoiceLine}
                                                      removeInvoiceLine={removeInvoiceLine}
                                                      key={invoiceLine.id}
                            />
                        ))}
                        </tbody>
                    </table>
                </div>

                {errors.length > 0 && (
                    <div className="flex flex-col gap-2 p-2 border border-gray-400 rounded shadow">
                        <div className="text-lg font-bold">Validation Errors:</div>
                        <ul className="list-disc ml-10">
                        {errors.map((error) => (
                            <li className="text-red-700">{error}</li>
                        ))}
                        </ul>
                        <div><button onClick={() => setErrors([])}>
                            <div className="flex flex-row gap-2">
                                <FaEraser/>
                                <div>Clear Errors</div>
                            </div>
                        </button> </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-row gap-3 p-2 border border-gray-400 rounded shadow text-right">
                    <button onClick={() => setEditedInvoice(undefined)}
                            className="border border-gray-400 rounded shadow px-2">
                        <div className="flex flex-row gap-1 align-middle items-center">
                            <FaUndo aria-label="Cancel Changes"/>
                            <div>Cancel Changes</div>
                        </div>

                    </button>
                    {errors.length === 0 && (<button type="submit" onClick={saveInvoice}>
                        <div className="flex flex-row gap-1 align-middle items-center">
                            <FaSave aria-label="Save Changes"/>
                            <div>Save Changes</div>
                        </div>
                    </button>)}
                </div>
            </div>
        </Modal>
    )
}