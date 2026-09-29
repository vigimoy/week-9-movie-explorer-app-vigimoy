import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

const variants = cva('button', {
  variants: { variant: { default: 'button-primary', secondary: 'button-secondary', ghost: 'button-ghost' }, size: { default: '', icon: 'button-icon' } },
  defaultVariants: { variant: 'default', size: 'default' },
});
type Props = ComponentProps<'button'> & VariantProps<typeof variants> & { asChild?: boolean };
export function Button({ className, variant, size, asChild, ...props }: Props) {
  const Component = asChild ? Slot : 'button';
  return <Component className={cn(variants({ variant, size }), className)} {...props} />;
}

