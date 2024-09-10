interface WebhookHotmartRequestDto {
    data: {
        buyer: {
            name: string;
            email: string;
            checkout_phone: string;
        };
    }
}

export { WebhookHotmartRequestDto };