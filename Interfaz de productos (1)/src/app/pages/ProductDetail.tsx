import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, ShoppingCart, Store, Flame, TrendingDown, Plus, Minus } from 'lucide-react';
import { mockProducts, getAllPricesForProduct } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = mockProducts.find(p => p.id === Number(id));
  
  if (!product) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
        <Button onClick={() => navigate('/productos')}>
          Volver al catálogo
        </Button>
      </div>
    );
  }

  const allPrices = getAllPricesForProduct(product.id);
  const lowestPrice = Math.min(...allPrices.map(p => p.precio.valor));
  const currentPrice = product.precio.valor;
  const savings = currentPrice > lowestPrice ? currentPrice - lowestPrice : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'proteina':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'bebestible':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'insumo':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'ensalada':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'proteina':
        return 'Proteína';
      case 'bebestible':
        return 'Bebestible';
      case 'insumo':
        return 'Insumo';
      case 'ensalada':
        return 'Ensalada';
      default:
        return category;
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} ${product.nombre} agregado${quantity > 1 ? 's' : ''} al carrito`);
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate('/productos')}>
        <ArrowLeft className="size-4 mr-2" />
        Volver al catálogo
      </Button>

      {/* Product Main Info */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Product Image Placeholder */}
        <div className="space-y-4">
          <div className="aspect-square bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
            <Flame className="size-32 text-orange-500 opacity-50" />
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="space-y-6">
          <div>
            <Badge className={getCategoryBadgeColor(product.category)}>
              {getCategoryLabel(product.category)}
            </Badge>
            <h1 className="text-4xl font-bold mt-4">{product.nombre}</h1>
            <p className="text-xl text-muted-foreground mt-2">{product.tipo}</p>
          </div>

          <Separator />

          {/* Price Section */}
          <div className="space-y-4">
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold">{formatPrice(currentPrice)}</span>
              {savings > 0 && (
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingDown className="size-4" />
                  <span className="text-sm">Ahorra {formatPrice(savings)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Store className="size-4" />
              <span>Disponible en {product.comercio.nombre}</span>
            </div>
          </div>

          <Separator />

          {/* Product Details */}
          <div className="space-y-3">
            <h3 className="font-semibold">Detalles del Producto</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Flame className="size-4 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Calorías</p>
                  <p className="font-medium">{product.calorias} cal</p>
                </div>
              </div>

              {product.category === 'bebestible' && 'formato' in product && (
                <div>
                  <p className="text-sm text-muted-foreground">Formato</p>
                  <p className="font-medium capitalize">{product.formato}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Quantity Selector and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Cantidad:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                >
                  <Minus className="size-4" />
                </Button>
                <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={incrementQuantity}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button size="lg" className="w-full" onClick={handleAddToCart}>
                <ShoppingCart className="size-5 mr-2" />
                Agregar al Carrito - {formatPrice(currentPrice * quantity)}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Total: {formatPrice(currentPrice * quantity)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Price Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Comparación de Precios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {allPrices.map((item, index) => {
              const isLowest = item.precio.valor === lowestPrice;
              return (
                <div
                  key={index}
                  className={`p-4 border rounded-lg ${
                    isLowest ? 'border-green-500 bg-green-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Store className="size-4" />
                      <span className="font-medium">{item.comercio.nombre}</span>
                    </div>
                    {isLowest && (
                      <Badge className="bg-green-500 hover:bg-green-500">Mejor Precio</Badge>
                    )}
                  </div>
                  <p className="text-2xl font-bold">{formatPrice(item.precio.valor)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Actualizado: {new Date(item.precio.fecha).toLocaleDateString('es-CL')}
                  </p>
                  {item.comercio.enlace && (
                    <Button
                      variant="link"
                      className="p-0 h-auto mt-2"
                      onClick={() => window.open(item.comercio.enlace, '_blank')}
                    >
                      Ver en tienda →
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
