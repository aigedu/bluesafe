import { useState, useEffect, useCallback } from 'react';

export const useNotifications = () => {
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        const updatePermission = () => {
            if ('Notification' in window) {
                setPermission(Notification.permission);
            }
        };

        updatePermission();

        if ('permissions' in navigator) {
            navigator.permissions.query({ name: 'notifications' }).then((permissionStatus) => {
                // FIX: The `PermissionState` type ('prompt') from `permissionStatus.state` is not assignable to `NotificationPermission` ('default'). Map 'prompt' to 'default'.
                setPermission(permissionStatus.state === 'prompt' ? 'default' : permissionStatus.state);
                permissionStatus.onchange = () => {
                    // FIX: The `PermissionState` type ('prompt') from `permissionStatus.state` is not assignable to `NotificationPermission` ('default'). Map 'prompt' to 'default'.
                    setPermission(permissionStatus.state === 'prompt' ? 'default' : permissionStatus.state);
                };
            });
        } else {
            // Fallback for older browsers
            document.addEventListener('visibilitychange', updatePermission);
            return () => document.removeEventListener('visibilitychange', updatePermission);
        }
    }, []);

    const requestPermission = useCallback(async () => {
        if (!('Notification' in window)) {
            alert('Trình duyệt này không hỗ trợ thông báo trên màn hình.');
            return 'denied';
        }
        const status = await Notification.requestPermission();
        setPermission(status); // Update state directly for immediate feedback
        return status;
    }, []);

    const sendNotification = useCallback((title: string, body: string) => {
        if (Notification.permission !== 'granted') {
            console.log('Quyền gửi thông báo chưa được cấp.');
            return;
        }
        
        if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
            navigator.serviceWorker.ready.then(registration => {
                // FIX: The project's TypeScript definitions for NotificationOptions appear to be missing the 'vibrate' property.
                // Casting to 'any' to bypass the type check and allow the property, which is supported by browsers for notifications.
                registration.showNotification(title, {
                    body: body,
                    icon: '/vite.svg',
                    badge: '/vite.svg',
                    vibrate: [200, 100, 200],
                } as any);
            });
        }
    }, []);

    return { permission, requestPermission, sendNotification };
};
