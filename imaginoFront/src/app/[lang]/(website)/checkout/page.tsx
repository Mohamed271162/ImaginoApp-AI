import Container from '@/components/shared/Container/Container';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTheme } from 'next-themes';
export default function Checkout() {
  const { theme } = useTheme();
  return (
    <Container className="py-16">
      <div className="w-full max-w-2xl mx-auto bg-white shadow-xl rounded-3xl p-10 border border-gray-200">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Image
            src={`/${theme === 'dark' ? 'logo-dark.png' : 'logo.png'}`}
            width={100}
            height={50}
            alt="brand_logo"
            className="rounded-xl"
          />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
            <p className="text-muted-foreground text-sm">Subscribe to Imagino Pro</p>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-muted/40 p-6 rounded-2xl mb-6">
          <p className="text-muted-foreground text-sm">Annual subscription</p>
          <p className="text-3xl font-bold text-foreground">
            $379.00 <span className="text-base font-medium text-muted-foreground"> / year</span>
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            Get 2+ months free with the annual plan!
          </p>
        </div>

        {/* Item */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3 items-center">
            <Image
              src="/checkout_logo.png"
              width={55}
              height={55}
              alt="checkout_logo"
              className="rounded-xl"
            />
            <div>
              <p className="font-semibold text-lg">Imagino Pro</p>
              <p className="text-muted-foreground text-sm">Unlimited images + advanced tools</p>
            </div>
          </div>
          <p className="font-semibold">$379.00</p>
        </div>

        <hr className="my-4" />

        {/* Coupon */}
        <div className="mb-6">
          <Label className="text-sm font-semibold">Coupon</Label>
          <div className="flex gap-3 mt-2">
            <Input placeholder="Enter coupon code" className="rounded-xl" />
            <Button
              variant="secondary"
              className="rounded-xl px-6 font-semibold hover:text-gray-600 cursor-pointer"
            >
              Apply
            </Button>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-between text-lg mb-2">
          <p className="text-muted-foreground">Subtotal</p>
          <p>$379.00</p>
        </div>

        <div className="flex justify-between text-xl font-bold mb-6">
          <p>Total Due Today</p>
          <p>$379.00</p>
        </div>

        {/* Payment Button */}
        <Button className="bg-main-hover hover:bg-main text-black  text-xl font-bold w-full py-7 rounded-2xl">
          Pay With Stripe
        </Button>
      </div>
    </Container>
  );
}
