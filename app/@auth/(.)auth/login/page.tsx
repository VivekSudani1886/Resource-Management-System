'use client';

import { Modal } from '@/app/ui/modal';
import LoginContent from '@/app/ui/login-content';

export default function LoginInterception() {
    return (
        <Modal>
            <LoginContent />
        </Modal>
    );
}
