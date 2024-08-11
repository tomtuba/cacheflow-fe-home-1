import React, {ChangeEvent} from 'react';
import {InvoiceLine} from "../models/Invoice";
import {showCurrency} from "../utilities/converters";

export interface InvoiceLineEditComponentProps {
    invoiceLine: InvoiceLine;
    setInvoiceLine: (invoiceLine: InvoiceLine) => void;
}

export function InvoiceLineEditComponent({invoiceLine, setInvoiceLine}: InvoiceLineEditComponentProps) {
    const handleUpdate = (event: ChangeEvent<HTMLInputElement>) => {
        if (invoiceLine && event?.target?.value !== undefined) {
            setInvoiceLine({...invoiceLine, [event?.target?.name]: event?.target?.value});
        }
    }

    return (
        <tr>
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