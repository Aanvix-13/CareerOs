import { successResponse, handleApiError } from '@/lib/api-response';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const plans = await prisma.planDefinition.findMany({
      orderBy: { monthlyPrice: 'asc' }
    });
    
    const formattedPlans = plans.map(p => ({
      plan: p.plan,
      monthlyPrice: Number(p.monthlyPrice),
      yearlyPrice: Number(p.yearlyPrice),
      configuration: p.configuration
    }));

    return successResponse(formattedPlans);
  } catch (error) {
    return handleApiError(error);
  }
}
