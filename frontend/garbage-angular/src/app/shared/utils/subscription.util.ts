/**
 * check for subscription being initialised before unsubscribing
 */
export function unsubscribe(subscription: any) {
  if (subscription) {
    subscription.unsubscribe();
  }
}
