import {Invoice, InvoiceLine} from "../models/Invoice";

export const validateInvoice = (invoice: Invoice): string[] => {
    const errors = new Set<string>();

    if ((invoice.customer_name ?? '').length < 3) {
        errors.add("Customer name should be at least 3 characters");
    }

    if (!isEmail(invoice.customer_email)) {
        errors.add("Customer email address should be valid");
    }

    if ((invoice.description ?? '').length < 3) {
        errors.add("Invoice description should be at least 3 characters long");
    }

    if (!invoice.due_date) {
        errors.add("Invoice due date is required");
    }

    if (invoice.details?.length < 1) {
        errors.add("Invoice details are required");
    }

    if (invoice.total <= 0) {
        errors.add("Invoice total should be positive");
    }

    invoice.details.forEach((detail) => {
        validateInvoiceLine(detail).forEach((error) => errors.add(error));
    });

    return Array.from(errors);
}

export const validateInvoiceLine = (invoiceLine: InvoiceLine): string[] => {
    const errors: string[] = [];

    if (invoiceLine.quantity <= 0) {
        errors.push("Invoice line quantity must be greater than 0");
    }

    if (invoiceLine.amount <= 0) {
        errors.push("Invoice line amount must be greater than 0");
    }

    if (invoiceLine.description?.length < 3) {
        errors.push("Invoice line description must be at least 3 characters long");
    }

    return errors;
}

const isEmail = (search:string):boolean =>
{
    return EMAIL_REGEX.test(search);
}

const EMAIL_REGEX = new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/);