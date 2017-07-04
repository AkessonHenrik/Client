export const defaultAvatar = '../assets/defaultAvatar.png';
export const nodeRadius = 30;
export const nodeImageWidth = 60;
export const fontSize = 30;
export const genders = ['male', 'female', 'other']
export function loggedIn() {
    return localStorage["treemily_id"] !== undefined
}
export function getUserId() {
    return +localStorage["treemily_id"];
}

export function getGender(gender: number): string {
    return genders[gender];
}