import UserForm from '@/app/ui/users/create-form';

export default function Page() {
    return (
        <main>
            <h1 className="mb-4 text-xl md:text-2xl text-foreground">Create User</h1>
            <UserForm />
        </main>
    );
}
