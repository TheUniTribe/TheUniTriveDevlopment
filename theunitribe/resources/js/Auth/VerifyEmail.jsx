import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

export default function VerifyEmail({ status }) {
    const [processing, setProcessing] = useState(false);

    const handleResendEmail = (e) => {
        e.preventDefault();
        setProcessing(true);
        
        Inertia.post('/email/verification-notification', {}, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Email Verification" />

            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Email Verification Required
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Thanks for signing up! Before getting started, please verify your email address by clicking on the link we just emailed to you.
                    </p>
                </div>

                {status && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm text-green-800">{status}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form onSubmit={handleResendEmail}>
                        <div className="space-y-6">
                            <div>
                                <p className="text-sm text-gray-600">
                                    If you didn't receive the email, we will gladly send you another.
                                </p>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {processing ? 'Sending...' : 'Resend Verification Email'}
                                </button>
                            </div>

                            <div className="text-center">
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="text-sm text-indigo-600 hover:text-indigo-500"
                                >
                                    Log Out
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
