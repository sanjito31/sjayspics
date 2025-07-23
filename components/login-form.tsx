"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormMessage,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { 
  Alert,
  AlertDescription,
  AlertTitle, 
} from "./ui/alert"
import { AlertCircleIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "@/lib/auth/user"
import { useRouter } from "next/navigation"
import { useState } from "react"

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters long")
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const router = useRouter();
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ error, setError ] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null)
    setLoading(true)
    const { success } = await signIn(values.email, values.password)

    if(success) {
      router.push("/admin/dashboard")
      setLoading(false)
    } else {
      // console.log("Error: ", message)
      setError("Invalid email or password.")
      setLoading(false)
    }
  }



  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                {error && 
                  <Alert variant="destructive">
                    <AlertCircleIcon />
                    <AlertTitle>{error}</AlertTitle>
                    <AlertDescription>
                      <p>Please verify your login details and try again.</p>
                    </AlertDescription>
                  </Alert>
                }
                <div className="grid gap-6">
                  <div className="grid gap-3">
                  <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              disabled={loading}
                              type="email"
                              placeholder="m@example.com"
                              {...field} >
                            </Input>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} 
                    />
                  </div> 
                  <div className="grid gap-3">
                    <div className="flex flex-col gap-2">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input 
                                disabled={loading}
                                type="password"
                                placeholder="********"
                                {...field} >
                              </Input>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} 
                      />
                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                  </div>
                  {loading ? <Button className="w-full">Logging in...</Button> 
                    : <Button type="submit" className="w-full">
                        Login
                      </Button>
                  }
                </div>   
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
