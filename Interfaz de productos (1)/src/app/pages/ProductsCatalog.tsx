import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { mockProducts } from '../data/mockData';
import { ProductCategory } from '../types/product';
import ProductCard from '../components/ProductCard';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

export default function ProductsCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'calories'>('name');
  const { addToCart } = useCart();

  const handleAddToCart = (product: typeof mockProducts[0]) => {
    addToCart(product, 1);
    toast.success(`${product.nombre} agregado al carrito`);
  };

  // Filtrar productos
  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.tipo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Ordenar productos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.nombre.localeCompare(b.nombre);
      case 'price-asc':
        return a.precio.valor - b.precio.valor;
      case 'price-desc':
        return b.precio.valor - a.precio.valor;
      case 'calories':
        return a.calorias - b.calorias;
      default:
        return 0;
    }
  });

  const getCategoryCount = (category: ProductCategory) => {
    return mockProducts.filter(p => p.category === category).length;
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold">Catálogo de Productos</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Encuentra todo lo que necesitas para tu asado perfecto
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={sortBy} onValueChange={(value: typeof sortBy) => setSortBy(value)}>
          <SelectTrigger className="w-full md:w-[200px]">
            <Filter className="size-4 mr-2" />
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Nombre A-Z</SelectItem>
            <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
            <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
            <SelectItem value="calories">Calorías</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as typeof selectedCategory)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            Todos ({mockProducts.length})
          </TabsTrigger>
          <TabsTrigger value="proteina">
            Proteínas ({getCategoryCount('proteina')})
          </TabsTrigger>
          <TabsTrigger value="bebestible">
            Bebestibles ({getCategoryCount('bebestible')})
          </TabsTrigger>
          <TabsTrigger value="insumo">
            Insumos ({getCategoryCount('insumo')})
          </TabsTrigger>
          <TabsTrigger value="ensalada">
            Ensaladas ({getCategoryCount('ensalada')})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-8">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">No se encontraron productos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
