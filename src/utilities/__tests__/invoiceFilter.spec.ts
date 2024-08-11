import {sampleInvoice} from "./validators.spec";
import {matchesFilter} from "../invoiceFilter";
import {InvoiceStatus} from "../../models/Invoice";

describe('tests for invoiceFilter', () => {
    it('should match for empty status', () => {
        const result = matchesFilter(sampleInvoice, '', false);
        expect(result).toEqual(true);
    })

    it('should match for correct status', () => {
        const result = matchesFilter(sampleInvoice, sampleInvoice.status, false);
        expect(result).toEqual(true);
    })

    it('should not match for different status', () => {
        const result = matchesFilter(sampleInvoice, InvoiceStatus.PAID, false);
        expect(result).toEqual(false);
    })

    it('should match for overdue', () => {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() - 10);
        const invoice = {...sampleInvoice, due_date: dueDate};
        const result = matchesFilter(invoice, '', true);
        expect(result).toEqual(true);
    })

    it('should not match for future', () => {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 10);
        const result = matchesFilter({...sampleInvoice, due_date: dueDate}, '', true);
        expect(result).toEqual(false);
    })
})