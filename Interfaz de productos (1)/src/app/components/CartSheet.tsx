import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useCart } from '../context/CartContext';

export default function CartSheet() {
  const { cart, removeFromCart, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <ShoppingCart className="size-5" />
          {getTotalItems() > 0 && (
            <Badge className="absolute -top-2 -right-2 size-5 flex items-center justify-center p-0 rounded-full">
              {getTotalItems()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Carrito de Compras</span>
            {cart.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearCart}
                className="text-destructive hover:text-destructive"
              >
                Limpiar
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="size-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4 p-4 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{item.product.nombre}</h4>
                      <p className="text-sm text-muted-foreground">{item.product.tipo}</p>
                      <p className="text-sm font-medium mt-1">
                        {formatPrice(item.product.precio.valor)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <X className="size-4" />
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-7"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          {item.quantity === 1 ? <Trash2 className="size-3" /> : <Minus className="size-3" />}
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-7"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="size-3" />
                        </Button>
                      </div>

                      <p className="text-sm font-semibold">
                        {formatPrice(item.product.precio.valor * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total de items:</span>
                  <span className="font-medium">{getTotalItems()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
              </div>

              <Button className="w-full" size="lg">
                Continuar con el Evento
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
