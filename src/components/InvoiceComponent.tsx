import React from "react";
import {Invoice, InvoiceStatus} from "../models/Invoice";
import {FaEdit, FaGlasses, FaStopCircle, FaThumbsUp, FaTrash} from "react-icons/fa";
import {showCurrency} from "../utilities/converters";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import {isInvoiceOverdue} from "../utilities/invoiceFilter";

export interface InvoiceComponentProps {
    invoice: Invoice;
    editInvoice: (invoice: Invoice) => void;
    approveInvoice: (invoice: Invoice) => void;
    removeInvoice: (id: string) => void;
}

export function InvoiceComponent({invoice, approveInvoice, editInvoice, removeInvoice}: InvoiceComponentProps) {

    const confirmRemoveInvoice = () => {
        if (window.confirm("Are you sure you want to remove invoice?")) {
            removeInvoice(invoice.id);
        }
    }

    const canEdit = () => {
        return invoice.status === InvoiceStatus.DRAFT;
    }

    return (
        <tr className="even:bg-gray-100">
            <td>
                <div>{invoice.customer_email}</div>
            </td>
            <td>
                <div>{invoice.customer_name}</div>
            </td>
            <td>
                <div>{invoice.description}</div>
            </td>
            <td>
                {invoice.due_date && <div>{new Date(invoice.due_date).toLocaleDateString()}</div>}
            </td>
            <td>
                <div className="text-red-600">{isInvoiceOverdue(invoice) && <FaStopCircle/>}</div>
            </td>
            <td>
                <div className="capitalize">{invoice.status}</div>
            </td>
            <td>
                <div className="text-right">{showCurrency(invoice.total)}</div>
            </td>

            {/* Action Buttons */}
            <td>
                <div className="flex flex-row gap-1 p-1">
                    {canEdit() &&
                        <button onClick={() => editInvoice(invoice)}>
                            <div className="flex flex-row gap-1 px-1 items-center align-middle">
                                <FaEdit aria-label="Edit Invoice"/>
                                <div>Edit</div>
                            </div>
                        </button>
                    }
                    <button onClick={confirmRemoveInvoice}>
                        <div className="flex flex-row gap-1 px-1 items-center align-middle">
                            <FaTrash aria-label="Delete Invoice"/>
                            <div>Delete</div>
                        </div>
                    </button>

                    {canEdit() &&
                        <button onClick={() => approveInvoice(invoice)}>

                            <div className="flex flex-row gap-1 px-1 items-center align-middle">

                                <FaThumbsUp aria-label="Approve Invoice"/>
                                <div>Approve</div>
                            </div>
                        </button>}

                    {!canEdit() &&
                        <button onClick={() => editInvoice(invoice)}>
                            <div className="flex flex-row gap-1 px-1 items-center align-middle">
                                <FaGlasses aria-label="View Invoice"/>
                                <div>View</div>
                            </div>
                        </button>}
                </div>
            </td>
        </tr>
    );
}