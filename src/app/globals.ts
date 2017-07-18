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

export const parentTypes: string[] = ["adoptive", "biological", "guardian"]

export const server = 'http://localhost:9000'
export const profileEndpoint = server + "/profile"
export const familyEndpoint = server + "/family"
export const relationshipsEndpoint = server + "/relationships"
export const signupEndpoint = server + "/signup"
export const ghostEndpoint = server + "/ghost"
export const parentsEndpoint = server + "/parents"
export const relationshipTypes: string[] = ["Spouse", "Partner", "Sibling", "Cousin", "Friend", "Other/Unknown"]
export const fileEndpoint = server + "/assets/";
export const eventEndpoint = server + "/event";
export const commentEndpoint = server + "/comment";