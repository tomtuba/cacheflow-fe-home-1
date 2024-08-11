export const showCurrency = (amount: string | number | undefined): string => {

    amount = parseFloat("" + (amount ?? 0));
    return amount.toLocaleString("en-US",
        { style: "currency", currency: "USD"}
    );
}

export const capitalizeFirstLetter = (s: string | undefined): string | undefined => {
    if (s?.length) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
    return s;
}