import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 bg-gray-100">

      <header className="text-center my-12">
        <h1 className="text-4xl font-bold text-gray-900">Phonebook Management System</h1>
        <p className="text-gray-600 mt-2">Securely manage your contacts and collaborate with ease.</p>
      </header>
      
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>User Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Sign up and sign in securely with JWT authentication.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Manage Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Admins can approve, deactivate, or delete users easily.</p>
          </CardContent>
          <CardContent>
            <p>Admins can share and sync contacts across users with real-time updates.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Contact Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Users can do CRUD operations with their own contacts.</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-10">
        <Link href="/auth/signup">
          <Button className="mr-4">Get Started</Button>
        </Link>
        <Link href="/auth/signin">
          <Button variant="outline">Login</Button>
        </Link>
      </div>
    </div>
  );
}