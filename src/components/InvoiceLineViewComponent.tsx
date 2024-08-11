import React from 'react';
import {InvoiceLine} from "../models/Invoice";
import {showCurrency} from "../utilities/converters";

export interface InvoiceLineViewComponentProps {
    invoiceLine: InvoiceLine;
}

export function InvoiceLineViewComponent({invoiceLine}: InvoiceLineViewComponentProps) {

    return (
        <tr>
            <td>
                <div className="text-right">{invoiceLine.quantity}</div>
            </td>
            <td>
                {invoiceLine.description}
            </td>
            <td>
                <div className="text-right">
                    {showCurrency(invoiceLine.amount)}
                </div>
            </td>
            <td>
                <div className="text-right">
                    {showCurrency(invoiceLine.quantity * invoiceLine.amount)}
                </div>
            </td>
        </tr>
    );
}