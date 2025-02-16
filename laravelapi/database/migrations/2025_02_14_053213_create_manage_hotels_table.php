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
        Schema::create('manage_hotels', function (Blueprint $table) {
            $table->id();
            $table->string('property_name')->nullable();
            $table->text('address')->nullable();
            $table->string('cost_per_night')->nullable();
            $table->string('number_of_available_rooms')->nullable();
            $table->string('property_image')->nullable();
            $table->string('Average_rating')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('manage_hotels');
    }
};
