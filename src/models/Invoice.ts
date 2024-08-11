import {v4 as uuidv4} from "uuid";

export enum InvoiceStatus {
    DRAFT = "draft",
    APPROVED = "approved",
    SENT = "sent",
    PAID = "paid",
}

export interface InvoiceLine {
    id: string;
    quantity: number;
    description: string;
    amount: number;
}

export interface Invoice {
    id: string;
    customer_email: string;
    customer_name: string;
    description: string;
    due_date: Date;
    status: InvoiceStatus;
    total: number;
    details: InvoiceLine[];
}

export const defaultInvoice = () : Invoice => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    return {
        id: uuidv4(),
        description: "",
        due_date: dueDate,
        details: [],
        customer_email: "",
        customer_name: "",
        total: 0,
        status: InvoiceStatus.DRAFT,
    }
}

export const defaultInvoiceLine = () : InvoiceLine => {
    return {
        id: uuidv4(),
        description: "",
        quantity: 1,
        amount: 0,
    }
}