import {Invoice, InvoiceLine, InvoiceStatus} from "../../models/Invoice";
import {validateInvoice} from "../validators";

const sampleInvoiceLine: InvoiceLine = {
    id: 'sample id',
    description: 'Test description',
    quantity: 10,
    amount: 10,
}

export const sampleInvoice: Invoice = {
    id: "Invoice Id",
    description: "Test description",
    customer_name: "Test customerName",
    customer_email: "test@test.com",
    total: 100,
    due_date: new Date(),
    status: InvoiceStatus.DRAFT,
    details: [sampleInvoiceLine, sampleInvoiceLine]
}

describe('Tests for validators', () => {
    it('should fail for bad email address', () => {
        const invoice = {...sampleInvoice, customer_email: "BAD EMAIL"};

        const errors = validateInvoice(invoice);

        expect(errors).toHaveLength(1);
        expect(errors[0].includes("email")).toBeTruthy();

    })

    it('should fail for short customer name', () => {
        const invoice = {...sampleInvoice, customer_name: "TS"};

        const errors = validateInvoice(invoice);

        expect(errors).toHaveLength(1);
        expect(errors[0].includes("name")).toBeTruthy();

    })

    it('should fail for short description', () => {
        const invoice = {...sampleInvoice, description: "TS"};

        const errors = validateInvoice(invoice);

        expect(errors).toHaveLength(1);
        expect(errors[0].includes("description")).toBeTruthy();
    })

    it('should fail for missing details', () => {
        const invoice = {...sampleInvoice, details: []};

        const errors = validateInvoice(invoice);
        expect(errors).toHaveLength(1);
        expect(errors[0].includes("details")).toBeTruthy();
    })

    it('should fail for zero total', () => {
        const invoice = {...sampleInvoice, total: 0};

        const errors = validateInvoice(invoice);
        expect(errors).toHaveLength(1);
        expect(errors[0].includes("total")).toBeTruthy();
    })
})