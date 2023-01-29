export default interface RequireNotifications {
  handleNotifications(action: 'accept' | 'reject'): Promise<void>;
}
