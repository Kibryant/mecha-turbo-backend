interface User {
    _id?: string;
    name: string;
    email: string;
    password: string;
    purchaseDate: Date;
    expirationDate: Date;
}

export { User }