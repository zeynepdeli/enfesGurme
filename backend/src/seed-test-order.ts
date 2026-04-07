import prisma from './config/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Test sipariş oluşturuluyor...')

  // 1. Test kullanıcı oluştur
  const hashedPassword = await bcrypt.hash('User123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'testuser@example.com' },
    update: {},
    create: {
      email: 'testuser@example.com',
      password: hashedPassword,
      name: 'Test Kullanıcı',
      role: 'USER'
    }
  })
  console.log('✅ Kullanıcı:', user.name)

  // 2. Kategori oluştur
  const category = await prisma.category.upsert({
    where: { slug: 'peynirler' },
    update: {},
    create: {
      name: 'Peynirler',
      slug: 'peynirler',
      description: 'Geleneksel peynir çeşitleri'
    }
  })
  console.log('✅ Kategori:', category.name)

  // 3. Ürün oluştur
  const product = await prisma.product.upsert({
    where: { slug: 'antep-peyniri' },
    update: {},
    create: {
      name: 'Antep Peyniri',
      slug: 'antep-peyniri',
      description: 'Geleneksel Antep peyniri',
      price: 150.50,
      stock: 50,
      categoryId: category.id,
      isActive: true
    }
  })
  console.log('✅ Ürün:', product.name)

  // 4. Adres oluştur veya var olanı bul
  let address = await prisma.address.findFirst({
    where: { 
      userId: user.id,
      title: 'Ev'
    }
  })

  if (!address) {
    address = await prisma.address.create({
      data: {
        userId: user.id,
        title: 'Ev',
        fullName: 'Test Kullanıcı',
        phone: '05551234567',
        address: 'Test Mahallesi Test Sokak No:1',
        city: 'Gaziantep',
        district: 'Şahinbey',
        zipCode: '27000',
        isDefault: true
      }
    })
  }
  console.log('✅ Adres:', address.title)

  // 5. Sipariş oluştur
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      addressId: address.id,
      total: 301.00,
      status: 'PENDING',
      items: {
        create: [
          {
            productId: product.id,
            quantity: 2,
            price: 150.50
          }
        ]
      }
    },
    include: {
      items: true
    }
  })
  console.log('✅ Sipariş oluşturuldu! ID:', order.id)
  console.log('   - Toplam:', order.total, 'TL')
  console.log('   - Ürün sayısı:', order.items.length)
  
  console.log('\n🎉 Tamamlandı! Frontend\'te /admin/orders sayfasına git.')
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
