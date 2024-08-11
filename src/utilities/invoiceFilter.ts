import {Invoice, InvoiceStatus} from "../models/Invoice";

export const matchesFilter = (invoice: Invoice, status: string, pastDueOnly: boolean): boolean => {
    const matchesStatus = status === '' || invoice.status === status;
    const matchesPastDueOnly = ! pastDueOnly || isInvoiceOverdue(invoice);
    return matchesStatus && matchesPastDueOnly;
}

export const isInvoiceOverdue = (invoice: Invoice): boolean => {
    const invoiceUnpaid = [InvoiceStatus.DRAFT, InvoiceStatus.APPROVED].includes(invoice.status);
    const isPastDue = new Date(invoice.due_date).getTime() < new Date().getTime();
    console.log({due: invoice.due_date, date: new Date(invoice.due_date), isPastDue});
    return invoiceUnpaid && isPastDue;
}