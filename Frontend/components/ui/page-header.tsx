import { cn } from "@/lib/utils"

function PageHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section className={cn("", className)} {...props}>
      <div className="container-wrapper">
        <div className="container flex flex-col items-center gap-3 py-10 text-center md:py-16 lg:py-20 xl:gap-5">
          {children}
        </div>
      </div>
    </section>
  )
}

function PageHeaderHeading({
  className,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "max-w-2xl text-4xl font-bold tracking-tight text-balance lg:leading-[1.1] xl:text-6xl xl:tracking-tighter",
        "text-slate-900",
        className
      )}
      {...props}
    />
  )
}

function PageHeaderDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-muted-foreground max-w-3xl text-base text-balance sm:text-lg",
        className
      )}
      {...props}
    />
  )
}

function PageActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center gap-2 pt-2 **:data-[slot=button]:shadow-none",
        className
      )}
      {...props}
    />
  )
}

export { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading }