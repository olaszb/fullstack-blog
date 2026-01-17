export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user'; 
    created_at?: string;
    updated_at?: string;
}



// $table->id();
//             $table->string('name');
//             $table->string('email')->unique();
//             $table->timestamp('email_verified_at')->nullable();
//             $table->string('password');
//             $table->string('role')->default('user');
//             $table->rememberToken();
//             $table->timestamps();