import React, {ChangeEvent, useState} from "react";
import {defaultInvoice, Invoice, InvoiceStatus} from "../models/Invoice";
import {InvoiceComponent} from "./InvoiceComponent";
import {capitalizeFirstLetter, showCurrency} from "../utilities/converters";
import {sendEmail} from "../service/emailService";
import {InvoiceEditModal} from "./InvoiceEditModal";
import {InvoiceViewModal} from "./InvoiceViewModal";
import {validateInvoice} from "../utilities/validators";

import useLocalStorageState from "use-local-storage-state";
import {FaPlus} from "react-icons/fa";
import {matchesFilter} from "../utilities/invoiceFilter";

export function InvoiceListComponent() {
    const [invoices, setInvoices] = useLocalStorageState<Invoice[]>('invoices', {
        defaultValue: []
    });

    // Keeps a list of validation errors
    const [errors, setErrors] = useState<string[]>([]);

    const [statusFilter, setStatusFilter] = useState<string>("");

    const [editedInvoice, setEditedInvoice] = useState<Invoice>();

    const [pastDueOnly, setPastDueOnly] = useState<boolean>(false);

    const createInvoice = () => {
        const newInvoice = {...defaultInvoice()};
        setEditedInvoice(newInvoice);
    }

    const removeInvoice = (id: string) => {
        setInvoices([...invoices.filter((invoice) => invoice.id !== id)]);
        resetEditedInvoice();
    }

    const editInvoice = (invoice: Invoice) => {
        setEditedInvoice(invoice);
    }

    const resetEditedInvoice = () => {
        setEditedInvoice(undefined);
    }

    const approveInvoice = (invoice: Invoice) => {
        setErrors(validateInvoice(invoice));

        if (errors.length === 0) {
            const updatedInvoice = {...invoice, status: InvoiceStatus.APPROVED};
            sendEmail(updatedInvoice).then(() => {
                updateInvoice(updatedInvoice);
            });
        }
    }

    const updateInvoice = (invoice: Invoice) => {
        const ids = invoices.map((invoice) => invoice.id);
        const idMap = new Map(invoices.map((invoice) => [invoice.id, invoice]));
        if (! idMap.has(invoice.id)) {
            ids.push(invoice.id);
        }
        idMap.set(invoice.id, invoice);
        setInvoices(ids.map((id) => idMap.get(id)!));
        setEditedInvoice(undefined);
    }

    const invoiceFilter = (invoice: Invoice): boolean => {
        return matchesFilter(invoice, statusFilter, pastDueOnly);
    }

    return (
        <>
            <div className="flex flex-col gap-3 border border-gray-200 p-4 bg-white text-black text-sm text-left">
                <h1 className="text-xl font-extrabold">Invoices</h1>

                {/* Actions and Filters */}
                <div className="flex flex-row gap-1 align-middle items-center justify-between">

                    <button onClick={createInvoice} className="font-bold">
                        <div className="flex flex-row gap-1 align-middle items-center">
                            <FaPlus aria-label="Add Invoice"/>
                            <div>Create Invoice</div>
                        </div>
                    </button>
                    <div className="flex flex-row gap-3 align-middle items-center">
                        <div className="flex flex-row gap-1 align-middle items-center">
                            <input type="checkbox" checked={pastDueOnly} onChange={(event) => setPastDueOnly(event.target.checked)} />
                            <div>Past Due Only</div>
                        </div>
                        <div className="flex flex-row gap-2">
                            <div>Filter Invoices:</div>
                            <select value={statusFilter}
                                     onChange={(event: ChangeEvent<HTMLSelectElement>) => setStatusFilter(event.target.value)}>
                                <option value="">[ All ]</option>
                                {Object.values(InvoiceStatus).map((status) => (
                                    <option key={status} value={status} className="capitalize">{capitalizeFirstLetter(status)}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* List of invoices */}
                <table className="border border-gray-400">
                    <tbody>
                        <tr className="bg-gray-300">
                            <th>Customer Email</th>
                            <th>Customer Name</th>
                            <th>Description</th>
                            <th>Due Date</th>
                            <th>Past Due</th>
                            <th>Status</th>
                            <th><div className="text-right">Total</div></th>
                            <th>Actions</th>
                        </tr>
                        {invoices
                            .filter(invoiceFilter)
                            .map((invoice) =>
                                <InvoiceComponent
                                    invoice={invoice}
                                    key={invoice.id}
                                    approveInvoice={approveInvoice}
                                    editInvoice={editInvoice}
                                    removeInvoice={removeInvoice}
                                ></InvoiceComponent>
                            )}

                        {/* Summary Total Line */}
                        <tr className="bg-gray-300">
                            <td>
                                <div className="font-bold">Count: {invoices
                                    .filter(invoiceFilter).length}</div>
                            </td>
                            <td colSpan={5}>
                                <div className="font-bold text-right">Grand Total:</div>
                            </td>
                            <td>
                                <div className="font-bold text-right">
                                {showCurrency(invoices
                                    .filter(invoiceFilter)
                                    .map((invoice) => invoice.total)
                                    .reduce((total, invoice) => total + invoice, 0))}
                                </div>
                            </td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <InvoiceEditModal
                editedInvoice={editedInvoice}
                setEditedInvoice={setEditedInvoice}
                updateInvoice={updateInvoice}
                errors={errors}
            />
            <InvoiceViewModal
                editedInvoice={editedInvoice}
                setEditedInvoice={setEditedInvoice}
            />
        </>
    )
}