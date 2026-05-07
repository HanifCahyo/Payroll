import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Field, FieldDescription } from "@/Components/ui/field";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <section className="flex items-center justify-center w-full py-4 lg:py-4">
                <div className="w-full max-w-sm space-y-6">
                    <h2 className="mt-6 text-3xl font-bold">
                        Sign in to your account
                    </h2>
                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-2">
                            <Field>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="mt-1"
                                    placeholder="Enter your email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    aria-invalid={!!errors.email}
                                />
                                {errors.email ? (
                                    <FieldDescription>
                                        {errors.email}
                                    </FieldDescription>
                                ) : (
                                    <FieldDescription>
                                        Choose a unique email for your account.
                                    </FieldDescription>
                                )}
                            </Field>
                        </div>

                        <div className="space-y-2">
                            <Field>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                    className="mt-1"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    aria-invalid={!!errors.password}
                                />
                                {errors.password ? (
                                    <FieldDescription>
                                        {errors.password}
                                    </FieldDescription>
                                ) : (
                                    <FieldDescription>
                                        Enter your password.
                                    </FieldDescription>
                                )}
                            </Field>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="rememberMe" />
                                <label
                                    htmlFor="rememberMe"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Remember me
                                </label>
                            </div>

                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="text-sm hover:underline"
                                >
                                    Forgot your password?
                                </Link>
                            )}
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={processing}
                            >
                                Log in
                            </Button>
                        </div>
                    </form>
                </div>
            </section>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </GuestLayout>
    );
}
