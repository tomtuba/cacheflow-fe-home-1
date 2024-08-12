import React, {ChangeEvent} from 'react';
import {InvoiceLine} from "../models/Invoice";
import {showCurrency} from "../utilities/converters";
import {FaTrash} from "react-icons/fa";

export interface InvoiceLineEditComponentProps {
    invoiceLine: InvoiceLine;
    setInvoiceLine: (invoiceLine: InvoiceLine) => void;
    removeInvoiceLine: (id: string) => void;
}

export function InvoiceLineEditComponent({invoiceLine, removeInvoiceLine, setInvoiceLine}: InvoiceLineEditComponentProps) {
    const handleUpdate = (event: ChangeEvent<HTMLInputElement>) => {
        if (invoiceLine && event?.target?.value !== undefined) {
            setInvoiceLine({...invoiceLine, [event?.target?.name]: event?.target?.value});
        }
    }

    return (
        <tr className="odd:bg-white">
            <td>
                <button onClick={() => removeInvoiceLine(invoiceLine.id)}>
                    <div className="flex flex-row gap-2 align-middle items-center">
                        <FaTrash aria-label="Remove Invoice Line"/>
                        <div>Remove</div>
                    </div>
                </button>
            </td>
            <td>
                <input type="number" name="quantity"
                       value={invoiceLine.quantity} onChange={handleUpdate}/>
            </td>
            <td>
                <input type="text" name="description"
                       value={invoiceLine.description}
                       onChange={handleUpdate}/>
            </td>
            <td>
                <input type="number" name="amount"
                       value={invoiceLine.amount}
                       onChange={handleUpdate}/>
            </td>
            {/* The total price for the line is calculated */}
            <td>
                {showCurrency(invoiceLine.amount * invoiceLine.quantity)}
            </td>
        </tr>
    );
}