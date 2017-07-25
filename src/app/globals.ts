export const nodeRadius = 30;
export const nodeImageWidth = 60;
export const fontSize = 30;
export const genders = ['male', 'female', 'other']
export function loggedIn() {
    return localStorage["treemily_id"] !== undefined
}
export function getUserId() {
    if (localStorage["treemily_id"])
        return +localStorage["treemily_id"];
    else
        return null;
}

export function getGender(gender: number): string {
    return genders[gender];
}

export function getUserProfileId() {
    if (localStorage["treemily_profileid"]) {
        return +localStorage["treemily_profileid"]
    } else {
        return null;
    }
}

export const parentTypes: string[] = ["biological", "adoptive", "guardian"]
export const server = 'http://localhost:9000'
export const profileEndpoint = server + "/profile"
export const familyEndpoint = server + "/family"
export const relationshipsEndpoint = server + "/relationship"
export const signupEndpoint = server + "/signup"
export const ghostEndpoint = server + "/ghost"
export const parentsEndpoint = server + "/parents"
export const relationshipTypes: string[] = ["spouse", "partner", "sibling", "cousin", "friend", "other/unknown"]
export const relationshipIcons: string[] = ["/assets/wedding.svg", "/assets/heart.svg", "", "", "/assets/friend.svg", "/assets/other.png"]
export const fileEndpoint = server + "/assets/";
export const eventEndpoint = server + "/event";
export const commentEndpoint = server + "/comment";
export const groupEndpoint = server + "/group";
export const ownedEndpoint = server + "/owned";
export const ownedGroupsEndpoint = ownedEndpoint + "/groups";
export const claimEndpoint = server + "/claims";
export const notificationEndpoint = server + "/notification";