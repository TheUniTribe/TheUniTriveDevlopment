<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('community_ownership_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('community_id')->constrained('communities');
            $table->foreignId('previous_owner_id')->constrained('users');
            $table->foreignId('new_owner_id')->constrained('users');
            $table->foreignId('transferred_by')->nullable()->constrained('users');

            $table->enum('transfer_type', [
                'voluntary',
                'admin_forced',
                'automatic',
                'sold',
            ])->default('voluntary');

            $table->text('transfer_reason')->nullable();
            $table->decimal('transfer_amount', 10, 2)->nullable();
            $table->timestamp('transferred_at');
            $table->timestamps();

            $table->index('community_id');
            $table->index('previous_owner_id');
            $table->index('new_owner_id');
            $table->index('transferred_at');
            $table->index('transfer_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('community_ownership_history');
    }
};
