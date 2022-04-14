export enum HttpNotificationTypes {
    ERROR = 'errors',
    SUCCESS = 'successes'
}

export type IHttpNotification = {
    [key in HttpNotificationTypes]?: string[]
}

export const httpNotificationSend = (messages: string[], type: HttpNotificationTypes): IHttpNotification => {
    return { [type]: messages }
}