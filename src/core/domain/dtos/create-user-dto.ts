interface CreateUserDto {
    name: string;
    email: string;
    password: string;
    purchaseDate: Date;
    expirationDate: Date;
}

export { CreateUserDto }