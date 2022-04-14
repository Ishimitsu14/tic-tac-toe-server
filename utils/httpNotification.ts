// eslint-disable-next-line no-shadow
export enum HttpNotificationTypes {
    // eslint-disable-next-line no-unused-vars
    ERROR = 'errors',
    // eslint-disable-next-line no-unused-vars
    SUCCESS = 'successes'
}

export type IHttpNotification = {
    // eslint-disable-next-line no-unused-vars
    [key in HttpNotificationTypes]?: string[]
}

export const httpNotificationSend = (
  messages: string[],
  type: HttpNotificationTypes,
): IHttpNotification => ({ [type]: messages });
