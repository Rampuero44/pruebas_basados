import { Outlet } from 'react-router';
import { Flame } from 'lucide-react';
import CartSheet from '../components/CartSheet';

export default function ProductsLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="size-8 text-orange-500" />
            <div>
              <h1 className="text-xl font-bold">BASADOS</h1>
              <p className="text-xs text-muted-foreground">Sistema de Gestión de Asados</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <CartSheet />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>BASADOS - Sistema de Gestión de Asados © 2026</p>
        </div>
      </footer>
    </div>
  );
}
