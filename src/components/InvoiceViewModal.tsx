import {Invoice, InvoiceStatus} from "../models/Invoice";
import React from "react";
import Modal from "react-modal";
import {capitalizeFirstLetter, showCurrency} from "../utilities/converters";
import {InvoiceLineViewComponent} from "./InvoiceLineViewComponent";

export interface InvoiceViewModalProps {
    editedInvoice: Invoice | undefined;
    setEditedInvoice: (invoice: Invoice | undefined) => void;
}

export function InvoiceViewModal({editedInvoice, setEditedInvoice}: InvoiceViewModalProps) {
    return (
        <Modal
            isOpen={editedInvoice !== undefined && editedInvoice?.status !== InvoiceStatus.DRAFT}
            onRequestClose={() => setEditedInvoice(undefined)}
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
                                {editedInvoice?.customer_email}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Customer Name
                            </td>
                            <td>
                                {editedInvoice?.customer_name}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Description
                            </td>
                            <td>
                                {editedInvoice?.description}
                            </td>
                        </tr>
                        {editedInvoice?.due_date && (<tr>
                            <td>
                                Due Date
                            </td>
                            <td>
                                {new Date(editedInvoice.due_date).toLocaleDateString()}
                            </td>
                        </tr>)}
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
                                <div>{showCurrency(editedInvoice?.total)}</div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                {/* Invoice Details */}
                <div className="flex flex-col gap-1 p-2 border border-gray-400 rounded w-full shadow">
                    <div className="text-lg font-bold">Invoice Details:</div>
                    <table>
                        <tbody>
                            <tr>
                                <th><div className="text-right">Quantity</div></th>
                                <th>Description</th>
                                <th><div className="text-right">Amount</div></th>
                                <th><div className="text-right">Line Total:</div></th>
                            </tr>
                            {editedInvoice?.details.map((invoiceLine) => (
                                <InvoiceLineViewComponent invoiceLine={invoiceLine} key={invoiceLine.id} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Modal>
    )
}