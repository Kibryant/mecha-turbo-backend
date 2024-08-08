interface UpdateAdminDto {
    oldEmail: string;
    email?: string;
    password?: string;
    accessCode?: string;
}

export { UpdateAdminDto };